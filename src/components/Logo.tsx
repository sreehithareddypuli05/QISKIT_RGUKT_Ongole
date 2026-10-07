import { Link } from 'react-router-dom';
import { logo } from '../data/images';
export default function Logo({ light = true, to = '/' }: { light?: boolean; to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-3" aria-label="Quantum Innovation Centre, RGUKT Ongole — home">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white p-1 ring-1 ring-white/15 shadow-quantum">
        <img src={logo} alt="RGUKT Ongole logo" width={40} height={40} className="h-full w-full object-contain" />
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-lg font-semibold tracking-tight ${light ? 'text-slate-900' : 'text-navy-900'}`}>QIC</span>
        <span className={`block text-[11px] ${light ? 'text-slate-500' : 'text-mute'}`}>Quantum Innovation Centre</span>
      </span>
    </Link>
  );
}
