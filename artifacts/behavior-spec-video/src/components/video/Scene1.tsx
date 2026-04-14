import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { usePausableTimers } from '@/lib/video';

const REVIEWS = [
  { count: 280, quote: '"It gave me nothing."' },
  { count: 159, quote: '"It\'s unhelpful / low value."' },
  { count: 70, quote: '"It didn\'t answer what I asked."' },
];

const HOLD_DURATIONS = [2500, 2500, 3200];
const FADE_MS = 200;
const DATA_TAG_APPEAR = 6200;

function ThumbsDown({ size = '3vh' }: { size?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#ef4444" style={{ width: size, height: size }}>
      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
    </svg>
  );
}

export function Scene1({ isPlaying = true }: { isPlaying?: boolean }) {
  const [dataVisible, setDataVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const timerEvents = useMemo(() => {
    const events: Array<{ time: number; callback: () => void }> = [];

    events.push({ time: DATA_TAG_APPEAR, callback: () => setDataVisible(true) });

    let elapsed = DATA_TAG_APPEAR + 500;
    for (let i = 0; i < REVIEWS.length; i++) {
      const idx = i;
      events.push({ time: elapsed, callback: () => setActiveIndex(idx) });
      elapsed += FADE_MS + HOLD_DURATIONS[i] + FADE_MS;
    }
    return events;
  }, []);

  usePausableTimers(isPlaying, timerEvents);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 'calc(55% + 16px)',
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: '2vh',
          padding: '2vh 5vh',
          textAlign: 'center',
        }}
      >
        <h1
          className="font-display font-bold text-white"
          style={{
            fontSize: '5vh',
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            margin: 0,
          }}
        >
          User Feedback
        </h1>
      </motion.div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 'calc(45% + 2px + 24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.8vh',
        }}
      >
        {dataVisible && (
          <div
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '2vh',
              padding: '2vh 4vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '6vh',
            }}
          >
            <AnimatePresence mode="wait">
              {activeIndex < REVIEWS.length && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: -15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2vh',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    className="font-mono font-bold text-red-400"
                    style={{ fontSize: '3.5vh' }}
                  >
                    {REVIEWS[activeIndex].count}
                  </span>
                  <span
                    className="font-body text-white"
                    style={{ fontSize: '3vh', opacity: 0.9 }}
                  >
                    {REVIEWS[activeIndex].quote}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <motion.div
          animate={{ y: dataVisible ? 20 : 0, scale: dataVisible ? 0.75 : 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '2vh',
            padding: '2vh 4vh',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5vh',
          }}
        >
          <ThumbsDown size="2.5vh" />
          <span
            className="font-mono font-bold text-red-400"
            style={{ fontSize: '2.8vh' }}
          >
            1,548
          </span>
          <span
            className="font-body text-red-200"
            style={{ fontSize: '2.8vh', opacity: 0.9 }}
          >
            thumbs-down reviews
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
