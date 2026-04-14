import { motion } from 'framer-motion';
import { usePausableTypewriter } from '@/lib/video';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const QUESTION = "How much PTO have I accrued?";
const CHAR_DELAY = 70;

export function Scene6Intro({ isPlaying = true }: { isPlaying?: boolean }) {
  const typedText = usePausableTypewriter(isPlaying, QUESTION, CHAR_DELAY, 800);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ fontFamily: FONT_CHAT, overflow: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '5vh',
        }}
      >
        <motion.h2
          style={{
            fontFamily: FONT_CHAT,
            fontWeight: 800,
            fontSize: '4.5vh',
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.2,
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          The Routing Problem
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.2vh',
            flexDirection: 'row-reverse' as const,
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '0.4vh',
          }}>
            <span style={{ fontFamily: FONT_CHAT, fontSize: '1.2vh', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>ME</span>
          </div>
          <div
            style={{
              padding: '1.6vh 2.4vh',
              borderRadius: '18px',
              borderTopRightRadius: '5px',
              background: 'rgba(255,255,255,0.1)',
              fontFamily: FONT_CHAT,
              fontSize: '3.2vh',
              lineHeight: 1.4,
              color: '#ffffff',
              fontWeight: 500,
              minWidth: '12vw',
              minHeight: '4.5vh',
            }}
          >
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.53, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                display: 'inline-block',
                width: '2px',
                height: '3vh',
                background: 'rgba(255,255,255,0.7)',
                marginLeft: '2px',
                verticalAlign: 'middle',
                borderRadius: 2,
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
