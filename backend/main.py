import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional
import os, json, secrets, hashlib, hmac, urllib.parse
import jwt
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field

BASE = Path(__file__).resolve().parent
DATABASE_URL = os.getenv('DATABASE_URL', '').strip()
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = 'postgresql://' + DATABASE_URL[len('postgres://'):]

if not DATABASE_URL:
    raise RuntimeError('DATABASE_URL is required. Set it to your PostgreSQL connection string.')

SECRET = os.getenv('QIC_SECRET_KEY', 'dev-only-change-this-secret')
ALGORITHM = 'HS256'
TOKEN_MINUTES = int(os.getenv('QIC_TOKEN_MINUTES', '240'))
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173').rstrip('/')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:8000/api/auth/google/callback')
RESEND_API_KEY = os.getenv('RESEND_API_KEY', '').strip()
EMAIL_FROM = os.getenv('EMAIL_FROM', '').strip()
app = FastAPI(title='QIC RGUKT Quantum Portal API', version='2.0.0')
origins = [x.strip() for x in os.getenv('CORS_ORIGINS', f'{FRONTEND_URL},http://localhost:5173,http://127.0.0.1:5173').split(',') if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
security = HTTPBearer(auto_error=False)


def db():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def execute(conn, query, params=None):
    cur = conn.cursor()
    cur.execute(query.replace('?', '%s'), params or ())
    return cur

def hash_password(password: str, salt: Optional[bytes] = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 210_000)
    return f'pbkdf2_sha256$210000${salt.hex()}${digest.hex()}'


def verify_password(password: str, encoded: str) -> bool:
    try:
        scheme, rounds, salt_hex, digest_hex = encoded.split('$')
        candidate = hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt_hex), int(rounds)).hex()
        return hmac.compare_digest(candidate, digest_hex)
    except Exception:
        return False


def token_for(user_id: str, email: str, role: str = 'user'):
    now = datetime.now(timezone.utc)
    return jwt.encode({'sub': user_id, 'email': email, 'role': role, 'iat': now, 'exp': now + timedelta(minutes=TOKEN_MINUTES)}, SECRET, algorithm=ALGORITHM)


class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)

class ProfileRequest(BaseModel):
    country: str
    state: str
    college: str
    degree: str
    branch: str
    year: str
    qiskit_experience: str
    programming_languages: list[str]
    activities: list[str]
    quantum_level: str
    referral_code: Optional[str] = ''

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember: bool = True

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminItem(BaseModel):
    title: str
    description: str
    date: str = ''
    link: str = ''
    image: str = ''
    location: str = ''
    published: bool = True


def init_db():
    conn = db()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        google_id TEXT,
        verified INTEGER NOT NULL DEFAULT 0,
        profile_complete INTEGER NOT NULL DEFAULT 0,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pending_registrations (
        email TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        code_hash TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS profiles (
        user_id TEXT PRIMARY KEY,
        country TEXT,
        state TEXT,
        college TEXT,
        degree TEXT,
        branch TEXT,
        year TEXT,
        qiskit_experience TEXT,
        programming_languages TEXT,
        activities TEXT,
        quantum_level TEXT,
        referral_code TEXT,
        updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS states (id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL);
    CREATE TABLE IF NOT EXISTS colleges (
        id SERIAL PRIMARY KEY,
        state TEXT NOT NULL,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        UNIQUE(state,name)
    );
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT,
        link TEXT,
        image TEXT,
        location TEXT,
        published INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT,
        link TEXT,
        image TEXT,
        location TEXT,
        published INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS oauth_states (state TEXT PRIMARY KEY, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS user_activity (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        event TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at TEXT NOT NULL
    );
    """)
    conn.commit()

    if not execute(conn, 'SELECT 1 FROM admins LIMIT 1').fetchone():
        execute(conn, 'INSERT INTO admins(username,password_hash) VALUES (?,?)',
                ('admin', hash_password(os.getenv('ADMIN_PASSWORD', 'QIC@Admin2026'))))

    state_names = ['Andhra Pradesh','Telangana','Karnataka','Tamil Nadu','Kerala','Maharashtra','Delhi','Odisha','West Bengal','Gujarat','Rajasthan','Uttar Pradesh','Madhya Pradesh']
    for s in state_names:
        execute(conn, 'INSERT INTO states(name) VALUES (?) ON CONFLICT (name) DO NOTHING', (s,))

    colleges = [
      ('Andhra Pradesh','RGUKT Nuzvid','Nuzvid'),('Andhra Pradesh','RGUKT Ongole','Ongole'),('Andhra Pradesh','RGUKT RK Valley','Idupulapaya'),('Andhra Pradesh','IIT Tirupati','Tirupati'),('Andhra Pradesh','Andhra University','Visakhapatnam'),('Andhra Pradesh','JNTU Anantapur','Anantapur'),
      ('Telangana','IIT Hyderabad','Sangareddy'),('Telangana','IIIT Hyderabad','Hyderabad'),('Telangana','Osmania University','Hyderabad'),('Telangana','JNTUH','Hyderabad'),
      ('Karnataka','IISc Bengaluru','Bengaluru'),('Karnataka','IIT Dharwad','Dharwad'),('Karnataka','NITK Surathkal','Mangaluru'),
      ('Tamil Nadu','IIT Madras','Chennai'),('Tamil Nadu','Anna University','Chennai'),('Tamil Nadu','IIT Tiruchirappalli','Tiruchirappalli'),
      ('Kerala','IIT Palakkad','Palakkad'),('Kerala','IISER Thiruvananthapuram','Thiruvananthapuram'),
      ('Maharashtra','IIT Bombay','Mumbai'),('Maharashtra','COEP Technological University','Pune'),('Delhi','IIT Delhi','New Delhi'),('Delhi','University of Delhi','New Delhi'),
      ('Odisha','IIT Bhubaneswar','Bhubaneswar'),('West Bengal','IIT Kharagpur','Kharagpur'),('Gujarat','IIT Gandhinagar','Gandhinagar'),('Rajasthan','IIT Jodhpur','Jodhpur'),('Uttar Pradesh','IIT Kanpur','Kanpur'),('Madhya Pradesh','IIT Indore','Indore')]
    for row in colleges:
        execute(conn, 'INSERT INTO colleges(state,name,city) VALUES (?,?,?) ON CONFLICT (state,name) DO NOTHING', row)

    if not execute(conn, 'SELECT 1 FROM events LIMIT 1').fetchone():
        event_seed = [
          ('Qiskit Fall Fest, RGUKT Ongole','A five-day Qiskit Fall Fest hosted by RGUKT Nuzvid and co-hosted by RGUKT Ongole and RGUKT R.K. Valley.','5–9 October 2026','https://rguktn.ac.in/','RGUKT Nuzvid, Andhra Pradesh'),
          ('Quantum Machine Learning Workshop','A three-day workshop conducted by Jnan Yalla sir on Quantum Machine Learning using Qiskit, held from 7th to 9th March 2026.','7–9 March 2026','https://rguktn.ac.in/','RGUKT Ongole'),
          ('Quantum Basics Workshop','A three-day workshop conducted by Veeresh Kuruba sir from 24th to 26th August 2026, covering Quantum basics, Quantum gates and the basics of Qiskit.','24–26 August 2026','https://rguktn.ac.in/','RGUKT Ongole'),
        ]
        for row in event_seed:
            execute(conn, 'INSERT INTO events(title,description,date,link,location,published) VALUES (?,?,?,?,?,1)', row)

    if not execute(conn, 'SELECT 1 FROM achievements LIMIT 1').fetchone():
        achievement_seed = [
          ('Girl in Quantum Computing — Q-VOLUTION Hackathon','Dear Students, Proud Moment for RGUKT Ongole – Shining on the Global Quantum Stage!. We are delighted to share that Chandala Keerthana (O220762, E2, ECE), RGUKT Ongole, has won the “Girl in Quantum Computing” International Competition and will be representing our campus at the Q-VOLUTION Hackathon Grand Finale & Awards Ceremony on the International Quantum Computing Stage. We warmly invite you to join the Live Streaming today at 8:30 PM and witness this proud moment for our institution. Let us come together to celebrate this remarkable achievement and support our student representing RGUKT Ongole on the global stage.','2026','https://www.youtube.com/live/PKVoZLt0p_k?si=o1iDQl1vgsYKiZfo'),
          ('RGUKT Ongole student achievement — ECE','A proud student achievement from the Department of ECE, RGUKT Ongole, featuring Shaik Irfan and Keerthana Ch. Explore the original department announcement and the project created by the students.','2026','https://www.linkedin.com/posts/department-of-ece-rgukt-ongole_rguktongole-ece-studentachievement-activity-7511279014007959554-KgEh?utm_source=share&utm_medium=member_android&rcm=ACoAAFxTBrwBil1JktZ9--Y0qgqkgaqi7j1xi5Y'),
        ]
        for row in achievement_seed:
            execute(conn, 'INSERT INTO achievements(title,description,date,link) VALUES (?,?,?,?)', row)

    conn.commit()
    conn.close()
def send_otp(email: str, code: str):
    import urllib.request
    import urllib.error

    if not RESEND_API_KEY or not EMAIL_FROM:
        raise RuntimeError(
            'Email delivery is not configured. '
            'Set RESEND_API_KEY and EMAIL_FROM.'
        )

    payload = json.dumps({
        'from': EMAIL_FROM,
        'to': [email],
        'subject': 'QIC verification code',
        'text': (
            f'Your QIC verification code is {code}. '
            'It expires in 10 minutes. '
            'If you did not request this, ignore this email.'
        )
    }).encode('utf-8')

    request = urllib.request.Request(
        'https://api.resend.com/emails',
        data=payload,
        headers={
        'Authorization': f'Bearer {RESEND_API_KEY}',
        'Content-Type': 'application/json',
        'User-Agent': 'QIC-RGUKT-Ongole/1.0'
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            if response.status >= 300:
                raise RuntimeError(
                    f'Email provider returned HTTP {response.status}'
                )

    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode('utf-8', errors='replace')
        raise RuntimeError(
            f'Email provider error: {error_body}'
        ) from exc

    except Exception as exc:
        raise RuntimeError(
            f'Email delivery failed: {exc}'
        ) from exc

def current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials: raise HTTPException(401, 'Authentication required')
    try: payload = jwt.decode(credentials.credentials, SECRET, algorithms=[ALGORITHM])
    except jwt.PyJWTError: raise HTTPException(401, 'Invalid or expired session')
    conn = db(); row = execute(conn, 'SELECT id,first_name,last_name,email,role,profile_complete FROM users WHERE id=?', (payload.get('sub'),)).fetchone(); conn.close()
    if not row: raise HTTPException(401, 'User no longer exists')
    return row


def admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials: raise HTTPException(401, 'Admin authentication required')
    try: payload = jwt.decode(credentials.credentials, SECRET, algorithms=[ALGORITHM])
    except jwt.PyJWTError: raise HTTPException(401, 'Invalid or expired admin session')
    if payload.get('role') != 'admin': raise HTTPException(403, 'Admin access required')
    return payload


@app.on_event('startup')
def startup(): init_db()

@app.get('/api/health')
def health(): return {'status':'ok','service':'qic-api'}

@app.post('/api/auth/request-verification')
def request_verification(body: RegisterRequest):
    email = str(body.email).lower().strip(); code = f'{secrets.randbelow(1_000_000):06d}'
    conn = db(); existing = execute(conn, 'SELECT id FROM users WHERE email=?', (email,)).fetchone()
    if existing: conn.close(); raise HTTPException(409, 'An account with this email already exists. Please log in.')
    execute(conn, 'DELETE FROM pending_registrations WHERE email=?', (email,))
    execute(conn, 'INSERT INTO pending_registrations(email,first_name,last_name,password_hash,code_hash,expires_at,attempts) VALUES (?,?,?,?,?,?,0)', (email,body.first_name.strip(),body.last_name.strip(),hash_password(body.password),hash_password(code), (datetime.now(timezone.utc)+timedelta(minutes=10)).isoformat()))
    conn.commit(); conn.close()
    try: send_otp(email, code)
    except Exception as exc: raise HTTPException(503, str(exc))
    return {'message':'Verification code sent to your email address.','email':email,'expires_in_seconds':600}

@app.post('/api/auth/verify-verification', response_model=dict)
def verify_verification(body: VerifyCodeRequest):
    email = str(body.email).lower().strip(); conn = db(); row = execute(conn, 'SELECT * FROM pending_registrations WHERE email=?', (email,)).fetchone()
    if not row: conn.close(); raise HTTPException(400, 'Verification session expired. Please request a new code.')
    if datetime.fromisoformat(row['expires_at']) < datetime.now(timezone.utc): execute(conn, 'DELETE FROM pending_registrations WHERE email=?',(email,)); conn.commit(); conn.close(); raise HTTPException(400,'Verification code expired. Request a new code.')
    if not verify_password(body.code, row['code_hash']): conn.close(); raise HTTPException(400,'Invalid verification code.')
    user_id = secrets.token_hex(16)
    execute(conn, 'INSERT INTO users(id,first_name,last_name,email,password_hash,verified,profile_complete,role,created_at) VALUES (?,?,?,?,?,?,?,?,?)', (user_id,row['first_name'],row['last_name'],email,row['password_hash'],1,0,'user',datetime.now(timezone.utc).isoformat()))
    execute(conn, 'DELETE FROM pending_registrations WHERE email=?',(email,)); conn.commit(); conn.close()
    return {'message':'Email verified. Continue with your academic profile.','token':token_for(user_id,email),'user':{'id':user_id,'name':f"{row['first_name']} {row['last_name']}",'email':email,'profile_complete':False}}
@app.post('/api/auth/register')
def register(body: RegisterRequest):
    email = str(body.email).lower().strip()

    conn = db()

    existing = execute(
        conn,
        'SELECT id FROM users WHERE email=?',
        (email,)
    ).fetchone()

    if existing:
        conn.close()
        raise HTTPException(
            409,
            'An account with this email already exists. Please log in.'
        )

    user_id = secrets.token_hex(16)

    execute(
        conn,
        '''
        INSERT INTO users(
            id,
            first_name,
            last_name,
            email,
            password_hash,
            verified,
            profile_complete,
            role,
            created_at
        )
        VALUES (?,?,?,?,?,?,?,?,?)
        ''',
        (
            user_id,
            body.first_name.strip(),
            body.last_name.strip(),
            email,
            hash_password(body.password),
            1,
            0,
            'user',
            datetime.now(timezone.utc).isoformat()
        )
    )

    execute(
        conn,
        'INSERT INTO user_activity(user_id,event,created_at) VALUES (?,?,?)',
        (
            user_id,
            'registration',
            datetime.now(timezone.utc).isoformat()
        )
    )

    conn.commit()
    conn.close()

    return {
        'message': 'Account created successfully.',
        'token': token_for(user_id, email, 'user'),
        'user': {
            'id': user_id,
            'name': f'{body.first_name.strip()} {body.last_name.strip()}',
            'email': email,
            'role': 'user',
            'profile_complete': False
        }
    }
@app.post('/api/auth/login')
def login(body: LoginRequest):
    email=str(body.email).lower().strip(); conn=db(); row=execute(conn, 'SELECT * FROM users WHERE email=?',(email,)).fetchone()
    if not row or not verify_password(body.password,row['password_hash']): conn.close(); raise HTTPException(401,'Email or password is incorrect.')
    if not row['verified']: conn.close(); raise HTTPException(403,'Please verify your email before logging in.')
    now=datetime.now(timezone.utc).isoformat(); execute(conn, 'INSERT INTO user_activity(user_id,event,created_at) VALUES (?,?,?)',(row['id'],'login',now)); conn.commit(); conn.close()
    return {'token':token_for(row['id'],email,row['role']),'user':{'id':row['id'],'name':f"{row['first_name']} {row['last_name']}",'email':email,'role':row['role'],'profile_complete':bool(row['profile_complete'])}}

@app.post('/api/auth/logout')
def logout(user=Depends(current_user)):
    conn=db(); execute(conn, 'INSERT INTO user_activity(user_id,event,created_at) VALUES (?,?,?)',(user['id'],'logout',datetime.now(timezone.utc).isoformat())); conn.commit(); conn.close(); return {'message':'Logged out successfully.'}

@app.get('/api/auth/me')
def me(user=Depends(current_user)):
    return {'id':user['id'],'name':f"{user['first_name']} {user['last_name']}",'email':user['email'],'role':user['role'],'profile_complete':bool(user['profile_complete'])}

@app.post('/api/profile')
def save_profile(body: ProfileRequest, user=Depends(current_user)):
    conn=db()
    execute(conn, 'DELETE FROM profiles WHERE user_id=?', (user['id'],))
    execute(conn, 'INSERT INTO profiles(user_id,country,state,college,degree,branch,year,qiskit_experience,programming_languages,activities,quantum_level,referral_code,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', (user['id'],body.country,body.state,body.college,body.degree,body.branch,body.year,body.qiskit_experience,json.dumps(body.programming_languages),json.dumps(body.activities),body.quantum_level,body.referral_code or '',datetime.now(timezone.utc).isoformat()))
    execute(conn, 'UPDATE users SET profile_complete=1 WHERE id=?',(user['id'],))
    conn.commit(); conn.close(); return {'message':'Profile saved successfully.'}

@app.get('/api/profile')
def get_profile(user=Depends(current_user)):
    conn=db(); row=execute(conn, 'SELECT * FROM profiles WHERE user_id=?',(user['id'],)).fetchone(); conn.close()
    if not row: return None
    data=dict(row); data['programming_languages']=json.loads(data['programming_languages'] or '[]'); data['activities']=json.loads(data['activities'] or '[]'); return data

@app.get('/api/meta/states')
def states():
    conn=db(); rows=execute(conn, 'SELECT name FROM states ORDER BY name').fetchall(); conn.close(); return [r['name'] for r in rows]

@app.get('/api/meta/colleges')
def colleges(state: str = Query(..., min_length=2)):
    conn=db(); rows=execute(conn, 'SELECT id,name,city FROM colleges WHERE state=? ORDER BY name',(state,)).fetchall(); conn.close(); return [dict(r) for r in rows]

@app.get('/api/events')
def public_events():
    conn=db(); rows=execute(conn, 'SELECT * FROM events WHERE published=1 ORDER BY id DESC').fetchall(); conn.close(); return [dict(r) for r in rows]

@app.get('/api/achievements')
def public_achievements():
    conn=db(); rows=execute(conn, 'SELECT * FROM achievements WHERE published=1 ORDER BY id DESC').fetchall(); conn.close(); return [dict(r) for r in rows]

@app.post('/api/admin/login')
def admin_login(body: AdminLoginRequest):
    conn=db(); row=execute(conn, 'SELECT * FROM admins WHERE username=?',(body.username.strip(),)).fetchone(); conn.close()
    if not row or not verify_password(body.password,row['password_hash']): raise HTTPException(401,'Invalid admin username or password.')
    return {'token':token_for(str(row['id']),row['username'],'admin'),'admin':{'username':row['username'],'role':'admin'}}

@app.get('/api/admin/users')
def admin_users(_=Depends(admin_user)):
    conn=db(); rows=execute(conn, '''
      SELECT u.id,u.first_name,u.last_name,u.email,u.verified,u.profile_complete,u.created_at,
             p.country,p.state,p.college,p.degree,p.branch,p.year,p.qiskit_experience,p.programming_languages,p.activities,p.quantum_level,p.referral_code,
             (SELECT created_at FROM user_activity a WHERE a.user_id=u.id AND a.event='login' ORDER BY a.id DESC LIMIT 1) AS last_login,
             (SELECT created_at FROM user_activity a WHERE a.user_id=u.id AND a.event='logout' ORDER BY a.id DESC LIMIT 1) AS last_logout
      FROM users u LEFT JOIN profiles p ON p.user_id=u.id WHERE u.role='user' ORDER BY u.created_at DESC
    ''').fetchall(); conn.close()
    out=[]
    for r in rows:
        d=dict(r); d['programming_languages']=json.loads(d['programming_languages'] or '[]'); d['activities']=json.loads(d['activities'] or '[]'); out.append(d)
    return out

@app.get('/api/admin/activity')
def admin_activity(_=Depends(admin_user)):
    conn=db(); rows=execute(conn, '''SELECT a.id,a.user_id,a.event,a.ip_address,a.user_agent,a.created_at,u.first_name,u.last_name,u.email FROM user_activity a JOIN users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT 250''').fetchall(); conn.close(); return [dict(r) for r in rows]

@app.get('/api/admin/overview')
def admin_overview(_=Depends(admin_user)):
    conn=db(); users=execute(conn, "SELECT COUNT(*) c FROM users WHERE role='user'").fetchone()['c']; verified=execute(conn, "SELECT COUNT(*) c FROM users WHERE role='user' AND verified=1").fetchone()['c']; complete=execute(conn, "SELECT COUNT(*) c FROM users WHERE role='user' AND profile_complete=1").fetchone()['c']; events=execute(conn, 'SELECT COUNT(*) c FROM events').fetchone()['c']; achievements=execute(conn, 'SELECT COUNT(*) c FROM achievements').fetchone()['c']; conn.close(); return {'users':users,'verified_users':verified,'complete_profiles':complete,'events':events,'achievements':achievements}

@app.get('/api/admin/events')
def admin_events(_=Depends(admin_user)):
    conn=db(); rows=execute(conn, 'SELECT * FROM events ORDER BY id DESC').fetchall(); conn.close(); return [dict(r) for r in rows]

@app.get('/api/admin/achievements')
def admin_achievements(_=Depends(admin_user)):
    conn=db(); rows=execute(conn, 'SELECT * FROM achievements ORDER BY id DESC').fetchall(); conn.close(); return [dict(r) for r in rows]

@app.post('/api/admin/events')
def add_event(body: AdminItem, _=Depends(admin_user)):
    conn=db(); cur=execute(conn, 'INSERT INTO events(title,description,date,link,image,location,published) VALUES (?,?,?,?,?,?,?) RETURNING id',(body.title,body.description,body.date,body.link,body.image,body.location,int(body.published))); conn.commit(); item_id=cur.fetchone()['id']; item=execute(conn, 'SELECT * FROM events WHERE id=?',(item_id,)).fetchone(); conn.close(); return dict(item)

@app.post('/api/admin/achievements')
def add_achievement(body: AdminItem, _=Depends(admin_user)):
    conn=db(); cur=execute(conn, 'INSERT INTO achievements(title,description,date,link,image,location,published) VALUES (?,?,?,?,?,?,?) RETURNING id',(body.title,body.description,body.date,body.link,body.image,body.location,int(body.published))); conn.commit(); item_id=cur.fetchone()['id']; item=execute(conn, 'SELECT * FROM achievements WHERE id=?',(item_id,)).fetchone(); conn.close(); return dict(item)

@app.put('/api/admin/{kind}/{item_id}')
def update_item(kind: str, item_id: int, body: AdminItem, _=Depends(admin_user)):
    if kind not in ('events','achievements'): raise HTTPException(400,'Unknown content type')
    conn=db(); cur=execute(conn, f'UPDATE {kind} SET title=?,description=?,date=?,link=?,image=?,location=?,published=? WHERE id=?',(body.title,body.description,body.date,body.link,body.image,body.location,int(body.published),item_id)); conn.commit();
    if not cur.rowcount: conn.close(); raise HTTPException(404,'Item not found')
    item=execute(conn, f'SELECT * FROM {kind} WHERE id=?',(item_id,)).fetchone(); conn.close(); return dict(item)

@app.delete('/api/admin/{kind}/{item_id}')
def delete_item(kind: str, item_id: int, _=Depends(admin_user)):
    if kind not in ('events','achievements'): raise HTTPException(400,'Unknown content type')
    conn=db(); cur=execute(conn, f'DELETE FROM {kind} WHERE id=?',(item_id,)); conn.commit(); conn.close()
    if not cur.rowcount: raise HTTPException(404,'Item not found')
    return {'message':'Deleted'}

@app.get('/api/auth/google/start')
def google_start():
    if not GOOGLE_CLIENT_ID: raise HTTPException(503,'Google OAuth is not configured on this deployment.')
    state=secrets.token_urlsafe(32); conn=db(); execute(conn, 'INSERT INTO oauth_states(state,created_at) VALUES (?,?)',(state,datetime.now(timezone.utc).isoformat())); conn.commit(); conn.close()
    params={'client_id':GOOGLE_CLIENT_ID,'redirect_uri':GOOGLE_REDIRECT_URI,'response_type':'code','scope':'openid email profile','state':state,'access_type':'online','prompt':'select_account'}
    return {'url':'https://accounts.google.com/o/oauth2/v2/auth?'+urllib.parse.urlencode(params)}

@app.get('/api/auth/google/callback')
def google_callback(code: str, state: str):
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET: return RedirectResponse(FRONTEND_URL+'/login?oauth_error=Google+OAuth+is+not+configured')
    conn=db(); valid=execute(conn, 'SELECT 1 FROM oauth_states WHERE state=?',(state,)).fetchone(); execute(conn, 'DELETE FROM oauth_states WHERE state=?',(state,)); conn.commit(); conn.close()
    if not valid: return RedirectResponse(FRONTEND_URL+'/login?oauth_error=Invalid+OAuth+state')
    import urllib.request
    data=urllib.parse.urlencode({'code':code,'client_id':GOOGLE_CLIENT_ID,'client_secret':GOOGLE_CLIENT_SECRET,'redirect_uri':GOOGLE_REDIRECT_URI,'grant_type':'authorization_code'}).encode()
    try:
        req=urllib.request.Request('https://oauth2.googleapis.com/token',data=data,headers={'Content-Type':'application/x-www-form-urlencoded'}); token_data=json.loads(urllib.request.urlopen(req,timeout=15).read())
        req2=urllib.request.Request('https://openidconnect.googleapis.com/v1/userinfo',headers={'Authorization':'Bearer '+token_data['access_token']}); info=json.loads(urllib.request.urlopen(req2,timeout=15).read())
    except Exception: return RedirectResponse(FRONTEND_URL+'/login?oauth_error=Google+authentication+failed')
    email=info.get('email','').lower(); google_id=info.get('sub'); first=info.get('given_name') or info.get('name','Google').split(' ')[0]; last=info.get('family_name') or ''
    conn=db(); row=execute(conn, 'SELECT * FROM users WHERE email=?',(email,)).fetchone()
    if row:
        uid=row['id']; execute(conn, 'UPDATE users SET google_id=?,verified=1 WHERE id=?',(google_id,uid)); profile_complete=bool(row['profile_complete'])
    else:
        uid=secrets.token_hex(16); execute(conn, 'INSERT INTO users(id,first_name,last_name,email,password_hash,google_id,verified,profile_complete,role,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',(uid,first,last,email,hash_password(secrets.token_urlsafe(32)),google_id,1,0,'user',datetime.now(timezone.utc).isoformat())); profile_complete=False
    execute(conn, 'INSERT INTO user_activity(user_id,event,created_at) VALUES (?,?,?)',(uid,'login',datetime.now(timezone.utc).isoformat())); conn.commit(); conn.close(); t=token_for(uid,email,'user')
    return RedirectResponse(FRONTEND_URL+'/oauth-callback?token='+urllib.parse.quote(t)+'&profile_complete='+str(profile_complete).lower())
