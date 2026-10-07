// Optimized (webp) versions of the supplied QIC gallery. Filenames mirror the originals.
export type Img = { src: string; srcSet: string; w: number; h: number; alt: string };
const pair = (s640: string, s1280: string, w: number, h: number, alt: string): Img => ({
  src: s1280, srcSet: `${s640} 640w, ${s1280} 1280w`, w, h, alt,
});
import q1a from '../assets/qml/qml1-640.webp'; import q1b from '../assets/qml/qml1-1280.webp';
import q2a from '../assets/qml/qml2-640.webp'; import q2b from '../assets/qml/qml2-1280.webp';
import q3a from '../assets/qml/qml3-640.webp'; import q3b from '../assets/qml/qml3-1280.webp';
import q4a from '../assets/qml/qml4-640.webp'; import q4b from '../assets/qml/qml4-1280.webp';
import k2a from '../assets/qiskit/qiskit2-640.webp'; import k2b from '../assets/qiskit/qiskit2-1280.webp';
import k3a from '../assets/qiskit/qiskit3-640.webp'; import k3b from '../assets/qiskit/qiskit3-1280.webp';
import k4a from '../assets/qiskit/qiskit4-640.webp'; import k4b from '../assets/qiskit/qiskit4-1280.webp';
import a1a from '../assets/aqv/aqv1-640.webp'; import a1b from '../assets/aqv/aqv1-1280.webp';
import a2a from '../assets/aqv/aqv2-640.webp'; import a2b from '../assets/aqv/aqv2-1280.webp';
import a3a from '../assets/aqv/aqv3-640.webp'; import a3b from '../assets/aqv/aqv3-1280.webp';
import c1a from '../assets/achievements/achievement1-640.webp'; import c1b from '../assets/achievements/achievement1-1280.webp';
import c2a from '../assets/achievements/achievement2-640.webp'; import c2b from '../assets/achievements/achievement2-1280.webp';
export { default as logo } from '../assets/branding/rguktong.png';

export const QML = [
  pair(q1a, q1b, 1600, 719, 'Speaker presenting Quantum Machine Learning slides at the QIC workshop'),
  pair(q2a, q2b, 1600, 719, 'Students seated in the hall during the Quantum Machine Learning workshop'),
  pair(q3a, q3b, 1600, 1200, 'Speaker addressing the audience at the Quantum Machine Learning workshop'),
  pair(q4a, q4b, 1600, 1200, 'Participants and organisers at the Quantum Machine Learning workshop'),
];
export const QISKIT = [
  pair(k2a, k2b, 1599, 899, 'Speaker with participants at the Quantum Basics workshop'),
  pair(k3a, k3b, 1428, 804, 'Speaker presenting at the Quantum Basics workshop hall'),
  pair(k4a, k4b, 1071, 1428, 'Group photo with the speaker after the Quantum Basics workshop'),
];
export const AQV = [
  pair(a1a, a1b, 1600, 1302, 'Telugu poster announcing the Amaravati Quantum Valley Reference Facilities'),
  pair(a2a, a2b, 474, 266, 'Visual rendering of towers associated with Amaravati Quantum Valley'),
  pair(a3a, a3b, 1600, 1200, 'Visit to quantum hardware at an Amaravati Quantum Valley reference facility'),
];
export const ACH1 = pair(c1a, c1b, 793, 1122, 'Q-VOLUTION Hackathon invitation congratulating Keerthana of RGUKT Ongole');
export const ACH2 = pair(c2a, c2b, 1280, 853, 'Congratulations poster for Shaik Irfan and Keerthana Ch, ECE students at RGUKT Ongole');


export const QFF: Img[] = [
  { src: '/backgrounds/quantum-computing-interface.png', srcSet: '/backgrounds/quantum-computing-interface.png', w: 1536, h: 864, alt: 'Quantum computing visual for Qiskit Fall Fest' },
  { src: '/backgrounds/quantum-ai-lab.png', srcSet: '/backgrounds/quantum-ai-lab.png', w: 1536, h: 864, alt: 'Quantum research laboratory visual for Qiskit Fall Fest' },
  { src: '/backgrounds/quantum-interface.png', srcSet: '/backgrounds/quantum-interface.png', w: 1536, h: 864, alt: 'Quantum computing interface visual for Qiskit Fall Fest' },
];
