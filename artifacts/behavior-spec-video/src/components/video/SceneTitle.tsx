import { motion } from 'framer-motion';

export function SceneTitle({ isPlaying }: { isPlaying: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ zIndex: 10 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '5.5vh',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        Ready Bryte Behavior Spec
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '2.8vh',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          margin: 0,
          marginTop: '1.5vh',
          letterSpacing: '0.01em',
        }}
      >
        A new approach to AI product design
      </motion.p>
    </motion.div>
  );
}
