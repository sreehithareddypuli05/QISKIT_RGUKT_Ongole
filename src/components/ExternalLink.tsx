import { ExternalLink as Ext } from 'lucide-react';
import type { ReactNode } from 'react';
type P = { href: string; children: ReactNode; className?: string };
/** External links always open in a new tab and announce that to assistive tech. */
export default function ExternalLink({ href, children, className = '' }: P) {
  if (!href) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-mute ${className}`} title="Link to be added by QIC">
        {children} <span className="rounded bg-line px-1.5 py-0.5 text-[11px]">link to be added</span>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 underline-offset-4 hover:underline ${className}`}>
      {children}
      <Ext size={14} aria-hidden="true" />
      <span className="sr-only">(opens in a new tab, external site)</span>
    </a>
  );
}
