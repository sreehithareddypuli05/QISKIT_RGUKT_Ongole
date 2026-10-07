import { useEffect } from 'react';
const BASE = 'Quantum Innovation Centre | RGUKT Ongole';
const DESC = 'Quantum Innovation Centre at RGUKT Ongole — exploring, learning and building the quantum future.';
function setMeta(sel: string, attr: string, key: string, val: string) {
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', val);
}
export function useSeo(title?: string, description: string = DESC) {
  useEffect(() => {
    const t = title ? `${title} | QIC RGUKT Ongole` : BASE;
    document.title = t;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', t);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
  }, [title, description]);
}
