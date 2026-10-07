// Single source of truth for site content. Only blueprint-supported facts live here.
// Items marked TODO are intentionally left as placeholders until official sources are provided.
import { QML, QISKIT, QFF, type Img } from './images';

export const SITE = {
  name: 'Quantum Innovation Centre', short: 'QIC', campus: 'RGUKT Ongole',
  tagline: 'Exploring, learning and building the quantum future.',
};

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/qiskit-fall-fest', label: 'Qiskit Fall Fest' },
  { to: '/events', label: 'Events' },
  { to: '/minor-degree', label: 'Minor Degree' },
  { to: '/amaravati-quantum-valley', label: 'Amaravati Quantum Valley Initiative' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/about', label: 'About' },
];

export const FACULTY = [
  { name: 'Dr. G. V. Rajasekhar', email: 'gvrajasekhar@rguktong.ac.in', role: 'Associate Dean Academics · Faculty, Quantum Technologies Minor Degree Programme', bio: 'Supports academic coordination for the Quantum Technologies Minor Degree Programme and contributes to the growing quantum learning ecosystem at RGUKT Ongole.', image: 'src/assets/rajasekhar.jpeg' },
  { name: 'Dr. D. Ravichandra', email: 'ravichandra@rguktong.ac.in', role: 'Coordinator, Quantum Innovation Center & R&D Cell · Assistant Professor, Mechanical Engineering', bio: 'Coordinates research and development activities and the Quantum Innovation Center, helping connect quantum learning with research and student initiatives.', image: 'src/assets/ravichandra.jpeg' },
  { name: 'Mr. G. Srenivasa Rao', email: 'srenivasarao@rguktong.ac.in', role: 'Coordinator, Establishment Section · Faculty, Quantum Technologies Minor Degree Programme', bio: 'Supports establishment and programme coordination while contributing to the Quantum Technologies Minor Degree Programme and campus technical initiatives.', image: 'src/assets/sreenivasarao.jpg' },
];

export type QicEvent = {
  id: string; title: string; speaker?: string; date: string; start: string; topics: string[];
  summary: string; detail: string; images?: Img[]; hostedBy?: string; coHostedBy?: string[]; link?: string;
};
export const EVENTS: QicEvent[] = [
  {
    id: 'qff', title: 'Qiskit Fall Fest, RGUKT Ongole', date: '5–9 October 2026', start: '5–9 October 2026',
    hostedBy: 'RGUKT Nuzvid', coHostedBy: ['RGUKT Ongole', 'RGUKT R.K. Valley'], link: 'https://qffrguktn.com/',
    topics: ['Qiskit', 'Quantum computing', 'Community'],
    images: QFF,
    summary: 'A five-day Qiskit Fall Fest hosted by RGUKT Nuzvid and co-hosted by RGUKT Ongole and RGUKT R.K. Valley.',
    detail: 'The RGUKT edition brings students and the quantum community together around Qiskit learning, talks, practical sessions, project activities and community interaction. It is part of IBM Quantum’s wider Qiskit Fall Fest programme.',
  },
  {
    id: 'qml', title: 'Quantum Machine Learning Workshop', speaker: 'Jnan Yalla sir',
    date: '7–9 March 2026', start: '7–9 March 2026', topics: ['Quantum machine learning', 'Qiskit'],
    summary: 'A three-day workshop conducted by Jnan Yalla sir on Quantum Machine Learning using Qiskit.',
    detail: 'The workshop introduced students to quantum machine learning concepts and practical learning using Qiskit. The supplied gallery photographs are marked QML in the project.',
    images: QML,
  },
  {
    id: 'basics', title: 'Quantum Basics Workshop', speaker: 'Veeresh Kuruba sir',
    date: '24–26 August 2026', start: '24–26 August 2026', topics: ['Quantum basics', 'Quantum gates', 'Qiskit basics'],
    summary: 'A three-day workshop conducted by Veeresh Kuruba sir covering quantum basics, quantum gates and the basics of Qiskit.',
    detail: 'Students were introduced to the fundamentals of quantum technologies, quantum gates and Qiskit through a practical three-day learning programme. The supplied gallery photographs are marked QISKIT in the project.',
    images: QISKIT,
  },
];

export const STATS = [
  { value: 11, suffix: '', label: 'Minor Degree Subjects' },
  { value: 150, suffix: '+', label: 'Students Enrolled' },
  { value: 3, suffix: '', label: 'Highlighted Events' },
];

// URLs supplied in the QIC challenge guidebook.
export const LINKS = {
  liveStream: 'https://www.youtube.com/live/PKVoZLt0p_k?si=o1iDQl1vgsYKiZfo',
  linkedinPost: 'https://www.linkedin.com/posts/department-of-ece-rgukt-ongole_rguktongole-ece-studentachievement-activity-7511279014007959554-KgEh?utm_source=share&utm_medium=member_android&rcm=ACoAAFxTBrwBil1JktZ9--Y0qgqkgaqi7j1xi5Y',
  funquan: 'https://funquan.ai.studio',
  qff: 'https://rguktn.ac.in/',
  rgukt: 'https://rguktn.ac.in/',
  srmQrc: 'https://www.srmap.edu.in/qrc/',
  srmQuti: 'https://www.srmap.edu.in/quti/',
};

export const ROADMAP = [
  { id: 'f', title: 'Quantum Foundations', text: 'The ideas that make quantum different: states, superposition and measurement.' },
  { id: 'c', title: 'Quantum Computing', text: 'How those ideas become computation: qubits, gates and circuits.' },
  { id: 'p', title: 'Quantum Programming', text: 'Writing quantum programs and reading their results.' },
  { id: 'q', title: 'Qiskit', text: 'Hands-on practice with the Qiskit toolkit.' },
  { id: 'a', title: 'Applied Quantum Learning', text: 'Bringing the learning to projects, workshops and competitions.' },
];

export const AQV_NODES = [
  { id: 'gov', label: 'Government' },
  { id: 'acad', label: 'Academia' },
  { id: 'ind', label: 'Industry' },
  { id: 'start', label: 'Startups' },
  { id: 'res', label: 'Research' },
  { id: 'tal', label: 'Talent Development' },
  { id: 'inf', label: 'Quantum Infrastructure' },
];
export const AQV_THEMES = ['Research', 'Education', 'Infrastructure', 'Industry collaboration', 'Talent development', 'Startup innovation'];

// ---- AQV facts, researched from public reporting (April–Sept 2026). Reports differ in details; wording is kept cautious. ----
export const AQV_SOURCES = [
  { label: 'Government of India / PIB — Amaravati Quantum Centre foundation', href: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2225097&lang=1&reg=1' },
  { label: 'SRM University-AP — Quantum Research Centre', href: 'https://www.srmap.edu.in/qrc/' },
  { label: 'SRM University-AP — Quantum Valley partnership', href: 'https://www.srmap.edu.in/news/srm-ap-joins-ap-governments-quantum-valley-project-as-the-founding-academic-partner/' },
  { label: 'Qbit Force — Amaravati Quantum Reference Facilities', href: 'https://qbitforcequantum.com/events' },
];
export const AQV_PARTNERS = [
  { name: 'Government of Andhra Pradesh', role: 'Leads the Amaravati Quantum Valley initiative and the state quantum mission.' },
  { name: 'SRM University-AP', role: 'Founding academic partner and host of the Amaravati 1S Quantum Reference Facility.' },
  { name: 'IBM', role: 'Part of the wider quantum ecosystem announced around cloud access, innovation and future quantum infrastructure.' },
  { name: 'TCS', role: 'Industry partner connected with quantum use cases and access to quantum computing services.' },
  { name: 'Qbit Force', role: 'Quantum hardware company associated with the reference infrastructure at Medha Towers.' },
  { name: 'National Quantum Mission', role: 'National programme aligned with India’s broader quantum technology development.' },
];
export const AQV_FUTURE = [
  { t: 'Quantum Valley Tech Park', d: 'A tech park at Uddandarayunipalem, whose foundation stone was reported laid in February 2026.' },
  { t: 'IBM Quantum System Two', d: 'Planned deployment of a 156-qubit Heron system, reported as subject to export approvals and final agreements.' },
  { t: 'Quantum centre by December 2026', d: 'A fully functional quantum centre in the capital region is the stated aim of the Chief Minister.' },
  { t: 'Talent at scale', d: 'The Wiser Quantum Talent Hub is reported to target training 35 lakh students in quantum computing by 2035.' },
];
