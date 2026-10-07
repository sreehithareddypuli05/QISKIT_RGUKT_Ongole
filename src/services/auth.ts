const API_BASE=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');
export type AuthUser={id:string;email:string;name?:string;role?:string;profile_complete?:boolean};
export class AuthError extends Error{constructor(message:string){super(message);this.name='AuthError'}}
const TOKEN='qic.auth.token', USER='qic.auth.user';
export const token=()=>localStorage.getItem(TOKEN)||sessionStorage.getItem(TOKEN);
export const saveSession=(data:any,remember=true)=>{const s=remember?localStorage:sessionStorage;s.setItem(TOKEN,data.token);s.setItem(USER,JSON.stringify(data.user));if(remember){sessionStorage.removeItem(TOKEN);sessionStorage.removeItem(USER)}else{localStorage.removeItem(TOKEN);localStorage.removeItem(USER)}};
export const clearSession=()=>{localStorage.removeItem(TOKEN);localStorage.removeItem(USER);sessionStorage.removeItem(TOKEN);sessionStorage.removeItem(USER)};
export const readUser=():AuthUser|null=>{try{return JSON.parse(localStorage.getItem(USER)||sessionStorage.getItem(USER)||'null')}catch{return null}};
async function request(path:string,init?:RequestInit){const res=await fetch(API_BASE+path,{...init,headers:{'Content-Type':'application/json',...(token()?{Authorization:`Bearer ${token()}`}:{}) ,...(init?.headers||{})}});const data=await res.json().catch(()=>({}));if(!res.ok)throw new AuthError(data.detail||data.message||'Request failed.');return data}
export const authService={
 requestVerification:(body:any)=>request('/api/auth/request-verification',{method:'POST',body:JSON.stringify(body)}),
 verify:(body:any)=>request('/api/auth/verify-verification',{method:'POST',body:JSON.stringify(body)}),
 login:(body:any)=>request('/api/auth/login',{method:'POST',body:JSON.stringify(body)}),
 me:()=>request('/api/auth/me'),
 saveProfile:(body:any)=>request('/api/profile',{method:'POST',body:JSON.stringify(body)}),
 profile:()=>request('/api/profile'),
 googleStart:async()=>request('/api/auth/google/start'),
 logout:async()=>{try{await request('/api/auth/logout',{method:'POST'})}finally{clearSession()}},
};
export async function apiRequest(path:string,init?:RequestInit){return request(path,init)}
