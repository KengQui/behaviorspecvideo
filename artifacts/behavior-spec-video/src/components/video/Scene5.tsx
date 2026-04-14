import { motion } from 'framer-motion';
import { useMemo } from 'react';

const NETWORK_NODES = [
  { x: 7, y: 8, label: 'I need to update my address' },
  { x: 35, y: 14, label: 'Why was my timecard rejected?' },
  { x: 72, y: 11, label: 'How do I file a workplace complaint?' },
  { x: 12, y: 35, label: 'What benefits am I eligible for?' },
  { x: 55, y: 38, label: "My direct deposit didn't go through" },
  { x: 88, y: 42, label: 'Show me my PTO balance' },
  { x: 28, y: 58, label: 'Help me request leave without messing up coverage' },
  { x: 65, y: 62, label: 'How do I check my pay stub?' },
  { x: 8, y: 72, label: 'Who approves my expense report?' },
  { x: 45, y: 78, label: 'Can I change my tax withholding?' },
  { x: 80, y: 75, label: 'When is open enrollment?' },
  { x: 92, y: 88, label: 'Reset my password' },
  { x: 20, y: 90, label: 'Transfer to a different department' },
  { x: 58, y: 92, label: 'Schedule a meeting with HR' },
];

const NETWORK_EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
  [3, 4], [3, 6], [4, 7], [5, 7], [6, 8],
  [6, 9], [7, 10], [8, 12], [9, 13], [10, 11],
  [9, 6], [4, 10], [1, 3], [2, 4], [12, 13],
  [8, 9], [11, 7],
];

function NetworkBackground({ isPlaying }: { isPlaying: boolean }) {
  const edgeData = useMemo(() =>
    NETWORK_EDGES.map(([a, b], i) => {
      const n1 = NETWORK_NODES[a];
      const n2 = NETWORK_NODES[b];
      return { id: i, x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y, delay: 0.3 + i * 0.06 };
    }),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {edgeData.map((e) => (
          <motion.line
            key={`edge-${e.id}`}
            x1={`${e.x1}%`}
            y1={`${e.y1}%`}
            x2={`${e.x2}%`}
            y2={`${e.y2}%`}
            stroke="rgba(134,41,255,0.12)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isPlaying ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.2, delay: e.delay, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {NETWORK_NODES.map((node, i) => (
        <motion.div
          key={`node-${i}`}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={isPlaying ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5 + i * 0.08,
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        >
          <motion.div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: '1.5px solid rgba(134,41,255,0.5)',
              background: 'rgba(134,41,255,0.15)',
              margin: '0 auto',
            }}
            animate={isPlaying ? {
              boxShadow: [
                '0 0 4px rgba(134,41,255,0.2)',
                '0 0 12px rgba(134,41,255,0.5)',
                '0 0 4px rgba(134,41,255,0.2)',
              ],
            } : {}}
            transition={{
              duration: 2.5 + (i % 3) * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
          <motion.span
            style={{
              display: 'block',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5vh',
              color: 'rgba(160,100,255,0.8)',
              whiteSpace: 'nowrap',
              marginTop: 4,
              textAlign: 'center',
            }}
            initial={{ opacity: 0 }}
            animate={isPlaying ? {
              opacity: [0, 1, 1, 0],
            } : { opacity: 0 }}
            transition={{
              duration: 8,
              delay: 1.0 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {node.label}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

export function Scene5({ isPlaying = true }: { isPlaying?: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center items-center"
      style={{ padding: '10vh 10%' }}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(134,41,255,0.35) 0%, rgba(48,37,141,0.15) 40%, transparent 70%)',
        }}
        animate={isPlaying ? {
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4],
        } : { scale: 1, opacity: 0.4 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(134,41,255,0.15) 0%, transparent 50%)',
        }}
        animate={isPlaying ? {
          scale: [1.3, 1, 1.3],
          opacity: [0.2, 0.6, 0.2],
        } : { scale: 1, opacity: 0.2 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <NetworkBackground isPlaying={isPlaying} />

      <motion.div
        className="absolute"
        style={{
          width: '60vh',
          height: '60vh',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(134,41,255,0.4) 0%, rgba(134,41,255,0.1) 30%, transparent 60%)',
          filter: 'blur(40px)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.8, 0.5] }}
        transition={{ duration: 1.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute"
        style={{
          width: '120vh',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(134,41,255,0.6), rgba(255,255,255,0.3), rgba(134,41,255,0.6), transparent)',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1.2, 1], opacity: [0, 1, 0.6] }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1
          className="font-display font-bold text-white"
          style={{ fontSize: '12vh', lineHeight: 1, letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.3,
            type: 'spring',
            stiffness: 150,
            damping: 15,
          }}
        >
          Behavior{' '}
          <motion.span
            style={{ color: '#8629FF', display: 'inline-block' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              type: 'spring',
              stiffness: 200,
              damping: 12,
            }}
          >
            <motion.span
              style={{ display: 'inline-block' }}
              animate={isPlaying ? {
                textShadow: [
                  '0 0 20px rgba(134,41,255,0)',
                  '0 0 40px rgba(134,41,255,0.8)',
                  '0 0 20px rgba(134,41,255,0.3)',
                ],
              } : {}}
              transition={{ duration: 2, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Spec
            </motion.span>
          </motion.span>
        </motion.h1>

        <motion.div
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #8629FF, rgba(255,255,255,0.6), #8629FF, transparent)',
            margin: '3.5vh 0',
            boxShadow: '0 0 20px rgba(134,41,255,0.5)',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '25%', opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.p
          className="font-body text-white"
          style={{ fontSize: '3.8vh', lineHeight: 1.4, whiteSpace: 'nowrap' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.95, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
        >
          Design intent{' '}
          <motion.span
            style={{ display: 'inline-block', color: '#8629FF' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.4, type: 'spring', stiffness: 300, damping: 15 }}
          >
            →
          </motion.span>{' '}
          Production behavior
        </motion.p>

        <motion.div
          style={{ marginTop: '6vh' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <motion.span
            className="font-display font-bold text-white"
            style={{ fontSize: '2.5vh', letterSpacing: '0.25em', textTransform: 'uppercase' }}
            animate={isPlaying ? {
              opacity: [0.5, 0.9, 0.5],
            } : { opacity: 0.7 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            Bryte AI &middot; UKG Ready
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
