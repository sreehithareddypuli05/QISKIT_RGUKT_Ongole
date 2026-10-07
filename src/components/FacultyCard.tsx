import { Mail } from 'lucide-react';

type Props = { name: string; email: string; role: string; bio: string; image: string };
export default function FacultyCard({ name, email, role, bio, image }: Props) {
  return <article className="faculty-profile">
    <div className="faculty-photo-wrap"><img src={image} alt={`${name} profile`} className="faculty-photo" /></div>
    <div className="faculty-body"><p className="eyebrow">QIC COORDINATION</p><h3>{name}</h3><p className="faculty-role">{role}</p><p className="faculty-bio">{bio}</p><a href={`mailto:${email}`} className="faculty-mail"><Mail size={15}/><span>{email}</span></a></div>
  </article>;
}
