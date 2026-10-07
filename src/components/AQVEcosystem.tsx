import { useState } from 'react';
import { motion } from 'framer-motion';
import { AQV_NODES } from '../data/content';
const BLURB: Record<string, string> = {
  gov: 'Government provides the policy and ecosystem direction for the Valley.', acad: 'Universities and institutions connect education with research.', ind: 'Industry creates pathways from research to practical applications.', start: 'Startups turn emerging quantum ideas into products and ventures.', res: 'Research develops the scientific and technical foundations.', tal: 'Talent development builds the people needed for the quantum ecosystem.', inf: 'Infrastructure gives researchers and companies access to quantum systems and facilities.',
};
export default function AQVEcosystem() {
  const [sel, setSel] = useState<string | null>(null); const cur = AQV_NODES.find(n => n.id === sel);
  return <div className="aqv-pathway">
    <div className="aqv-center"><span>AMARAVATI</span><strong>QUANTUM VALLEY</strong></div>
    <div className="aqv-node-grid">{AQV_NODES.map((n,i)=><motion.button key={n.id} onClick={()=>setSel(sel===n.id?null:n.id)} whileHover={{y:-4}} whileTap={{scale:.98}} className={`aqv-node ${sel===n.id?'selected':''}`}><span>{String(i+1).padStart(2,'0')}</span><strong>{n.label}</strong></motion.button>)}</div>
    <div className="aqv-connection" aria-hidden="true"><i/><i/><i/><i/></div>
    <p className="aqv-description" aria-live="polite">{cur ? <><strong>{cur.label}.</strong> {BLURB[cur.id]}</> : 'Select a part of the ecosystem to see its role in the Valley.'}</p>
  </div>;
}
