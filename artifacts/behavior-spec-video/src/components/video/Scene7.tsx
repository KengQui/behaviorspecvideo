import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { usePausableTimers, usePausableTypewriter } from '@/lib/video';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

const ACCENT = '#60CDFF';
const ACCENT_PURPLE = '#A855F7';
const WHITE = '#ffffff';
const WHITE_DIM = 'rgba(255,255,255,0.88)';
const WHITE_BODY = 'rgba(255,255,255,0.95)';

type Phase =
  | 'query'
  | 'guardrails'
  | 'intent'
  | 'intent-clarify'
  | 'memory-compound'
  | 'tone'
  | 'routing';

const PHASE_TIMES: Record<Phase, number> = {
  'query': 0,
  'guardrails': 14500,
  'intent': 23000,
  'intent-clarify': 28500,
  'memory-compound': 40000,
  'tone': 54000,
  'routing': 60000,
};

interface Scene7Props {
  isPlaying?: boolean;
  initialPhase?: Phase;
}

const SPEC_SECTIONS = [
  { id: 'GRD', label: 'Guardrails & Safety', color: '#f87171' },
  { id: 'ID', label: 'Intent Detection', color: '#fbbf24' },
  { id: 'MEM', label: 'Conversation Memory', color: '#c084fc' },
  { id: 'CTX', label: 'Context Management', color: '#22d3ee' },
  { id: 'TONE', label: 'Tone & Personality', color: '#34d399' },
  { id: 'FMT', label: 'Response Formatting', color: '#818cf8' },
  { id: 'FB', label: 'Fallback & Recovery', color: '#f472b6' },
  { id: 'RT', label: 'Agent Routing', color: ACCENT },
];

const GRD_RULES = ['GRD-04', 'GRD-05', 'GRD-07', 'GRD-13', 'GRD-14'];

function RuleTag({ label, delay = 0, checked = false }: { label: string; delay?: number; checked?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.8vh',
        fontFamily: FONT_MONO,
        fontSize: '2.2vh',
        fontWeight: 700,
        padding: '0.8vh 1.6vh',
        borderRadius: 100,
        background: checked ? 'rgba(52,211,153,0.18)' : 'rgba(96,205,255,0.18)',
        border: checked ? '1.5px solid rgba(52,211,153,0.5)' : '1.5px solid rgba(96,205,255,0.45)',
        color: checked ? '#34d399' : ACCENT,
        letterSpacing: '0.05em',
      }}
    >
      {label}
      {checked && (
        <motion.svg
          width="2vh"
          height="2vh"
          viewBox="0 0 24 24"
          fill="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring', stiffness: 300 }}
        >
          <path d="M7 13l3 3 7-7" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      )}
    </motion.div>
  );
}

function SectionPill({ section, active, dimmed }: { section: typeof SPEC_SECTIONS[0]; active: boolean; dimmed: boolean }) {
  return (
    <motion.div
      animate={{
        opacity: dimmed ? 0.3 : 1,
      }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1vh',
        padding: '1.2vh 2vh',
        borderRadius: 12,
        background: active ? `${section.color}18` : 'rgba(255,255,255,0.03)',
        border: active ? `1.5px solid ${section.color}70` : '1.5px solid rgba(255,255,255,0.08)',
        transition: 'background 0.4s, border 0.4s',
      }}
    >
      <motion.div
        animate={{
          background: active ? section.color : 'rgba(255,255,255,0.2)',
          boxShadow: active ? `0 0 12px ${section.color}80` : 'none',
        }}
        transition={{ duration: 0.3 }}
        style={{
          width: '1.4vh',
          height: '1.4vh',
          borderRadius: '50%',
        }}
      />
      <span style={{
        fontFamily: FONT_MONO,
        fontSize: '1.8vh',
        fontWeight: 700,
        color: active ? section.color : 'rgba(255,255,255,0.5)',
        letterSpacing: '0.08em',
        minWidth: '4vh',
      }}>
        {section.id}
      </span>
      <span style={{
        fontFamily: FONT_CHAT,
        fontSize: '2vh',
        fontWeight: 600,
        color: active ? WHITE : 'rgba(255,255,255,0.5)',
      }}>
        {section.label}
      </span>
    </motion.div>
  );
}

export function Scene7({ isPlaying = true, initialPhase = 'query' }: Scene7Props) {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [ctxLit, setCtxLit] = useState(initialPhase !== 'memory-compound');
  const QUERY = "Help me request leave for next month without messing up coverage";

  const skipTyping = initialPhase !== 'query';
  const typedText = usePausableTypewriter(isPlaying, QUERY, 45, skipTyping ? 0 : 500);

  const timerEvents = useMemo(() => {
    if (initialPhase === 'memory-compound') {
      return [
        { time: 15000, callback: () => setCtxLit(true) },
      ];
    }
    if (initialPhase !== 'query') return [];
    return [
      { time: 14500, callback: () => setPhase('guardrails') },
      { time: 23000, callback: () => setPhase('intent') },
      { time: 28500, callback: () => setPhase('intent-clarify') },
      { time: 40000, callback: () => setPhase('memory-compound') },
    ];
  }, [initialPhase]);

  usePausableTimers(isPlaying, timerEvents);

  const activeSection = (() => {
    switch (phase) {
      case 'guardrails': return 'GRD';
      case 'intent':
      case 'intent-clarify': return 'ID';
      case 'memory-compound': return ctxLit ? 'CTX' : 'MEM';
      case 'tone': return 'TONE';
      case 'routing': return 'RT';
      default: return null;
    }
  })();

  const litSections = (() => {
    const sections: string[] = [];
    if (phase === 'guardrails') sections.push('GRD');
    if (phase === 'intent' || phase === 'intent-clarify') sections.push('GRD', 'ID');
    if (phase === 'memory-compound') {
      sections.push('GRD', 'ID', 'MEM');
      if (ctxLit) sections.push('CTX');
    }
    if (phase === 'tone') sections.push('GRD', 'ID', 'MEM', 'CTX', 'TONE');
    if (phase === 'routing') sections.push('GRD', 'ID', 'MEM', 'CTX', 'TONE', 'RT');
    return sections;
  })();

  return (
    <motion.div
      className="absolute inset-0 flex"
      style={{ fontFamily: FONT_CHAT, overflow: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={{
        width: '25%',
        padding: '5vh 2vh 5vh 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8vh',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.15)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: '2.8vh',
            fontWeight: 700,
            color: WHITE,
            marginBottom: '1vh',
            paddingBottom: '1vh',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          Orchestrator Spec
        </motion.div>
        {SPEC_SECTIONS.map((section) => (
          <SectionPill
            key={section.id}
            section={section}
            active={activeSection === section.id}
            dimmed={phase !== 'query' && !litSections.includes(section.id)}
          />
        ))}
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '3vh 4%',
        position: 'relative',
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: '4.5vh',
            fontWeight: 800,
            color: WHITE,
            marginBottom: '8vh',
            textAlign: 'center',
            marginTop: '15vh',
            flexShrink: 0,
          }}
        >
          {phase === 'query' && 'The Query Arrives'}
          {phase === 'guardrails' && 'Guardrails & Safety'}
          {(phase === 'intent' || phase === 'intent-clarify') && 'Intent Detection'}
          {phase === 'memory-compound' && 'Memory & Compound Intent'}
          {phase === 'tone' && 'Tone & Voice'}
          {phase === 'routing' && 'Agent Routing'}
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 'auto', minHeight: 0 }}>
          <AnimatePresence mode="wait">
            {phase === 'query' && (
              <motion.div
                key="query"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4vh' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5vh',
                  flexDirection: 'row-reverse',
                  maxWidth: '85%',
                }}>
                  <div style={{
                    width: '5vh',
                    height: '5vh',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: FONT_CHAT, fontSize: '1.8vh', fontWeight: 700, color: WHITE_DIM }}>ME</span>
                  </div>
                  <div style={{
                    padding: '2.5vh 3.5vh',
                    borderRadius: '20px',
                    borderTopRightRadius: '5px',
                    background: 'rgba(255,255,255,0.1)',
                    fontFamily: FONT_CHAT,
                    fontSize: '3.2vh',
                    lineHeight: 1.5,
                    color: WHITE,
                    fontWeight: 500,
                  }}>
                    {typedText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.53, repeat: Infinity, repeatType: 'reverse' }}
                      style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '3vh',
                        background: 'rgba(255,255,255,0.8)',
                        marginLeft: '2px',
                        verticalAlign: 'middle',
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'guardrails' && (
              <motion.div
                key="guardrails"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <motion.div
                  style={{
                    fontFamily: FONT_CHAT,
                    fontSize: '2.8vh',
                    color: WHITE_DIM,
                    textAlign: 'center',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  14 rules scanned in priority order
                </motion.div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.2vh',
                  justifyContent: 'center',
                  maxWidth: '50vw',
                }}>
                  {GRD_RULES.map((rule, i) => (
                    <RuleTag key={rule} label={rule} delay={0.5 + i * 0.4} checked={true} />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3, duration: 0.5 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2vh',
                    padding: '1.5vh 3vh',
                    borderRadius: 12,
                    background: 'rgba(52,211,153,0.12)',
                    border: '1.5px solid rgba(52,211,153,0.4)',
                  }}
                >
                  <motion.svg width="3vh" height="3vh" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="2" />
                    <path d="M7 13l3 3 7-7" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                  <span style={{ fontFamily: FONT_CHAT, fontSize: '2.6vh', fontWeight: 700, color: '#34d399' }}>
                    All clear — query moves forward
                  </span>
                </motion.div>
              </motion.div>
            )}

            {(phase === 'intent' || phase === 'intent-clarify') && (
              <motion.div
                key="intent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <div style={{
                  fontFamily: FONT_CHAT,
                  fontSize: '3.2vh',
                  color: WHITE,
                  textAlign: 'center',
                  lineHeight: 1.6,
                }}>
                  "...without messing up{' '}
                  <motion.span
                    animate={{
                      color: ['#ffffff', '#fbbf24', '#fbbf24'],
                      textShadow: ['none', '0 0 20px rgba(251,191,36,0.5)', '0 0 20px rgba(251,191,36,0.5)'],
                    }}
                    transition={{ duration: 1, delay: 0.3 }}
                    style={{ fontWeight: 800 }}
                  >
                    coverage
                  </motion.span>
                  "
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  style={{
                    display: 'flex',
                    gap: '2vw',
                    alignItems: 'stretch',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.4 }}
                    style={{
                      padding: '2vh 3vh',
                      borderRadius: 12,
                      background: 'rgba(251,191,36,0.1)',
                      border: '1.5px solid rgba(251,191,36,0.4)',
                      fontFamily: FONT_CHAT,
                      fontSize: '2.6vh',
                      color: '#fbbf24',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Team shift coverage
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.2 }}
                    style={{
                      fontFamily: FONT_CHAT,
                      fontSize: '3vh',
                      color: WHITE_DIM,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    vs
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.4 }}
                    style={{
                      padding: '2vh 3vh',
                      borderRadius: 12,
                      background: 'rgba(251,191,36,0.1)',
                      border: '1.5px solid rgba(251,191,36,0.4)',
                      fontFamily: FONT_CHAT,
                      fontSize: '2.6vh',
                      color: '#fbbf24',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Benefits coverage
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1.2vh' }}
                >
                  <RuleTag label="ID-05" delay={2} />
                  <span style={{ fontFamily: FONT_CHAT, fontSize: '2.4vh', color: WHITE_DIM }}>
                    Ambiguity — ask one clarifying question
                  </span>
                </motion.div>

                {phase === 'intent-clarify' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.5vh',
                      maxWidth: '85%',
                    }}
                  >
                    <div style={{
                      width: '5vh',
                      height: '5vh',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: '2vh', fontWeight: 800, color: WHITE }}>B</span>
                    </div>
                    <div style={{
                      padding: '2.5vh 3.5vh',
                      borderRadius: '20px',
                      borderTopLeftRadius: '5px',
                      background: 'rgba(168,85,247,0.14)',
                      border: '1.5px solid rgba(168,85,247,0.35)',
                      fontFamily: FONT_CHAT,
                      fontSize: '2.6vh',
                      lineHeight: 1.6,
                      color: WHITE_BODY,
                    }}>
                      When you say coverage — do you mean making sure your team's shifts are covered, or something related to your benefits coverage while you're on leave?
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {phase === 'memory-compound' && (
              <motion.div
                key="memory-compound"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.2vh',
                    flexDirection: 'row-reverse',
                    alignSelf: 'flex-end',
                    marginRight: '5%',
                  }}
                >
                  <div style={{
                    width: '4.5vh',
                    height: '4.5vh',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: FONT_CHAT, fontSize: '1.6vh', fontWeight: 700, color: WHITE_DIM }}>ME</span>
                  </div>
                  <div style={{
                    padding: '2vh 3vh',
                    borderRadius: '16px',
                    borderTopRightRadius: '4px',
                    background: 'rgba(255,255,255,0.1)',
                    fontFamily: FONT_CHAT,
                    fontSize: '2.8vh',
                    color: WHITE,
                    fontWeight: 600,
                  }}>
                    Team shifts
                  </div>
                </motion.div>

                <div style={{ display: 'flex', gap: '2vw', width: '90%', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={{
                      flex: 1,
                      padding: '2.5vh',
                      borderRadius: 14,
                      background: 'rgba(192,132,252,0.1)',
                      border: '1.5px solid rgba(192,132,252,0.35)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontFamily: FONT_MONO,
                      fontSize: '1.8vh',
                      fontWeight: 700,
                      color: '#c084fc',
                      letterSpacing: '0.1em',
                      marginBottom: '1vh',
                    }}>MEM</div>
                    <div style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_BODY }}>
                      Clarification stored — no repeat questions
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    style={{
                      flex: 1,
                      padding: '2.5vh',
                      borderRadius: 14,
                      background: 'rgba(251,191,36,0.1)',
                      border: '1.5px solid rgba(251,191,36,0.35)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8vh', marginBottom: '1vh' }}>
                      <span style={{ fontFamily: FONT_MONO, fontSize: '1.8vh', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.1em' }}>ID-02</span>
                    </div>
                    <div style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_BODY }}>
                      Compound intent detected: two tasks
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                    style={{
                      flex: 1,
                      padding: '2.5vh',
                      borderRadius: 14,
                      background: 'rgba(34,211,238,0.1)',
                      border: '1.5px solid rgba(34,211,238,0.35)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontFamily: FONT_MONO,
                      fontSize: '1.8vh',
                      fontWeight: 700,
                      color: '#22d3ee',
                      letterSpacing: '0.1em',
                      marginBottom: '1vh',
                    }}>CTX</div>
                    <div style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_BODY }}>
                      Context bundle assembled for handoff
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.2, duration: 0.5 }}
                  style={{
                    display: 'flex',
                    gap: '3vw',
                    alignItems: 'center',
                    padding: '2vh 3.5vh',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6vh' }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: '1.8vh', color: ACCENT, fontWeight: 700 }}>TASK 1</span>
                    <span style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE }}>Check shift coverage</span>
                  </div>
                  <motion.svg width="3.5vh" height="3.5vh" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke={WHITE_DIM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6vh' }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: '1.8vh', color: WHITE_DIM, fontWeight: 700 }}>TASK 2</span>
                    <span style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_DIM }}>Submit leave request</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {phase === 'tone' && (
              <motion.div
                key="tone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <motion.div
                  style={{
                    fontFamily: FONT_CHAT,
                    fontSize: '2.8vh',
                    color: WHITE_DIM,
                    textAlign: 'center',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  The Bryte voice — every agent speaks with one voice
                </motion.div>

                <div style={{
                  display: 'flex',
                  gap: '2vw',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                  {['Empowering', 'Effortless', 'Grounded', 'Supportive'].map((quality, i) => (
                    <motion.div
                      key={quality}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.3, type: 'spring', stiffness: 200 }}
                      style={{
                        padding: '2vh 3.5vh',
                        borderRadius: 14,
                        background: 'rgba(52,211,153,0.1)',
                        border: '1.5px solid rgba(52,211,153,0.4)',
                        fontFamily: FONT_DISPLAY,
                        fontSize: '3vh',
                        fontWeight: 700,
                        color: '#34d399',
                      }}
                    >
                      {quality}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'routing' && (
              <motion.div
                key="routing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3vw',
                  padding: '2vh 4vh',
                }}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                      padding: '2.5vh 3.5vh',
                      borderRadius: 16,
                      background: 'rgba(168,85,247,0.12)',
                      border: '2px solid rgba(168,85,247,0.4)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: '1.8vh', color: ACCENT_PURPLE, fontWeight: 700, marginBottom: '0.8vh' }}>ORCHESTRATOR</div>
                    <div style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_DIM }}>Tasks resolved</div>
                  </motion.div>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={{
                      width: '8vw',
                      height: '2px',
                      background: `linear-gradient(90deg, ${ACCENT_PURPLE}, ${ACCENT})`,
                      transformOrigin: 'left',
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    style={{
                      padding: '2.5vh 3.5vh',
                      borderRadius: 16,
                      background: 'rgba(96,205,255,0.1)',
                      border: '2px solid rgba(96,205,255,0.35)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: '1.8vh', color: ACCENT, fontWeight: 700, marginBottom: '0.8vh' }}>SCHEDULE AGENT</div>
                    <div style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_DIM }}>Check shift coverage</div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: '1.6vh',
                        color: '#34d399',
                        fontWeight: 700,
                        marginTop: '0.8vh',
                      }}
                    >
                      ACTIVE
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1.5, duration: 0.4 }}
                    style={{
                      padding: '2.5vh 3.5vh',
                      borderRadius: 16,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: '1.8vh', color: WHITE_DIM, fontWeight: 700, marginBottom: '0.8vh' }}>TIME OFF AGENT</div>
                    <div style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_DIM }}>Submit leave request</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: '1.6vh', color: WHITE_DIM, marginTop: '0.8vh' }}>QUEUED</div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  style={{
                    fontFamily: FONT_CHAT,
                    fontSize: '2.6vh',
                    color: WHITE_DIM,
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}
                >
                  Context travels with the handoff. The orchestrator's job is done.
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
