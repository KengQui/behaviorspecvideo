import { motion, AnimatePresence } from 'framer-motion';
import { usePausableElapsed } from '@/lib/video';

const NODES = [
  { x: 18, y: 15, label: 'Why is my pay short this week?' },
  { x: 68, y: 72, label: 'How do I add a new dependent?' },
  { x: 55, y: 10, label: 'Can I change my tax withholdings?' },
  { x: 85, y: 8, label: 'How much PTO have I accrued?' },
  { x: 85, y: 28, label: 'How do I request FMLA leave?' },
  { x: 35, y: 45, label: 'Why was my timecard rejected?' },
  { x: 65, y: 35, label: 'Can I swap shifts with a coworker?' },
  { x: 10, y: 38, label: 'I need to update my address' },
  { x: 12, y: 62, label: 'What benefits am I eligible for?' },
  { x: 42, y: 65, label: 'My direct deposit didn\'t go through' },
  { x: 82, y: 52, label: 'When does open enrollment start?' },
  { x: 55, y: 50, label: 'How do I file a workplace complaint?' },
  { x: 25, y: 82, label: 'Help me request leave without messing up coverage' },
  { x: 55, y: 85, label: 'How do I check my pay stub?' },
  { x: 85, y: 82, label: 'Who approves my time off?' },
];

const BROKEN_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 4],
  [8, 9], [9, 10], [10, 11],
  [12, 13], [13, 14],
  [0, 5], [5, 8], [1, 6], [6, 10],
  [2, 7], [3, 11], [8, 12], [10, 14],
];

const SPARKLE_EVENTS = [
  { nodeIndex: 0, showAt: 3500, hideAt: 6500 },
  { nodeIndex: 1, showAt: 7000, hideAt: 10000 },
  { nodeIndex: 5, showAt: 9500, hideAt: 12500 },
];

function DisconnectedNodes({ sparklingNodes }: { sparklingNodes: Set<number> }) {
  return (
    <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        {BROKEN_EDGES.map(([from, to], i) => (
          <motion.line
            key={`edge-${i}`}
            x1={NODES[from].x}
            y1={NODES[from].y}
            x2={NODES[to].x}
            y2={NODES[to].y}
            stroke="rgba(134,41,255,0.15)"
            strokeWidth="0.15"
            strokeDasharray="0.8 0.6"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {NODES.map((node, i) => {
        const isSparkling = sparklingNodes.has(i);
        return (
          <motion.div
            key={`node-${i}`}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6vh',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              style={{
                width: '1.2vh',
                height: '1.2vh',
                borderRadius: '50%',
                border: '1px solid rgba(134,41,255,0.25)',
                background: 'rgba(134,41,255,0.06)',
              }}
              animate={
                isSparkling
                  ? {
                      scale: [1, 2.2, 1.6],
                      background: [
                        'rgba(134,41,255,0.15)',
                        'rgba(220,180,255,1)',
                        'rgba(200,160,255,0.85)',
                      ],
                      boxShadow: [
                        '0 0 0px rgba(134,41,255,0)',
                        '0 0 28px rgba(220,180,255,0.9)',
                        '0 0 18px rgba(200,160,255,0.6)',
                      ],
                    }
                  : {
                      scale: [1, 1, 1.3, 1, 1],
                      background: [
                        'rgba(134,41,255,0.15)',
                        'rgba(134,41,255,0.15)',
                        'rgba(180,140,255,0.5)',
                        'rgba(134,41,255,0.15)',
                        'rgba(134,41,255,0.15)',
                      ],
                      boxShadow: [
                        '0 0 0px rgba(134,41,255,0)',
                        '0 0 2px rgba(134,41,255,0.1)',
                        '0 0 10px rgba(180,140,255,0.4)',
                        '0 0 2px rgba(134,41,255,0.1)',
                        '0 0 0px rgba(134,41,255,0)',
                      ],
                    }
              }
              transition={
                isSparkling
                  ? { duration: 0.5, ease: 'easeOut' }
                  : {
                      duration: 3 + (i % 3) * 0.5,
                      delay: 1 + (i * 0.7) % 4,
                      repeat: Infinity,
                      repeatDelay: 2 + (i % 5) * 0.6,
                      ease: 'easeInOut',
                      times: [0, 0.35, 0.5, 0.65, 1],
                    }
              }
            />
            <motion.span
              className="font-sans"
              animate={{
                fontSize: isSparkling ? '2.2vh' : '1vh',
                color: isSparkling
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(255,255,255,0.2)',
                textShadow: isSparkling
                  ? '0 0 12px rgba(200,160,255,0.6)'
                  : '0 0 0px rgba(0,0,0,0)',
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}
            >
              {node.label}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function SceneTransition({ isPlaying = true }: { isPlaying?: boolean }) {
  const elapsed = usePausableElapsed(isPlaying);

  const activeSparkles = new Set<number>();
  SPARKLE_EVENTS.forEach((event) => {
    if (elapsed >= event.showAt && elapsed < event.hideAt) {
      activeSparkles.add(event.nodeIndex);
    }
  });

  const showTagline = elapsed >= 13000;

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
      transition={{ duration: 0.5 }}
    >
      <DisconnectedNodes sparklingNodes={activeSparkles} />

      <AnimatePresence>
        {showTagline && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 10, pointerEvents: 'none', gap: '3vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.h1
              className="font-display font-bold text-center"
              style={{
                fontSize: '5.5vh',
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(0,0,0,0.6)',
                lineHeight: 1.3,
              }}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={{ color: '#ffffff' }}>Gemini knows how to be </span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>helpful</span>
              <br />
              <span style={{ color: '#ffffff' }}>but it doesn't know how to be </span>
              <span style={{ color: '#8629FF' }}>Bryte</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
