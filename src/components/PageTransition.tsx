import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
export default function PageTransition({ children }: { children: ReactNode }) {
  return <motion.div className="page-transition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
