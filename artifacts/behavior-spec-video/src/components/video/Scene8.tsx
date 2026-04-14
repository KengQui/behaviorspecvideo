import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { usePausableTimers } from '@/lib/video';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

const ACCENT = '#5ED3FF';
const ACCENT_PURPLE = '#A855F7';
const WHITE = '#ffffff';
const WHITE_DIM = 'rgba(255,255,255,0.88)';
const WHITE_BODY = 'rgba(255,255,255,0.95)';

type Phase =
  | 'receive'
  | 'guardrails-tone'
  | 'work'
  | 'formatting'
  | 'fallback'
  | 'handback';

type Clip = 'all' | 'c1' | 'c2' | 'c3' | 'c4';

interface Scene8Props {
  isPlaying?: boolean;
  clip?: Clip;
}

const AGENT_SPEC_SECTIONS = [
  { id: 'GRD', label: 'Guardrails', color: '#F87171' },
  { id: 'TONE', label: 'Tone & Voice', color: '#34D399' },
  { id: 'FMT', label: 'Response Formatting', color: '#818CF8' },
  { id: 'FB', label: 'Fallback & Recovery', color: '#F472B6' },
];

function AgentSectionPill({ section, active, dimmed }: { section: typeof AGENT_SPEC_SECTIONS[0]; active: boolean; dimmed: boolean }) {
  return (
    <motion.div
      animate={{
        opacity: dimmed ? 0.35 : 1,
      }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8vh',
        padding: '1.2vh 1.6vh',
        borderRadius: 10,
        background: active ? `${section.color}15` : 'rgba(255,255,255,0.03)',
        border: active ? `2px solid ${section.color}60` : '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.4s, border 0.4s',
      }}
    >
      <motion.div
        animate={{
          background: active ? section.color : 'rgba(255,255,255,0.15)',
          boxShadow: active ? `0 0 10px ${section.color}80` : 'none',
        }}
        transition={{ duration: 0.3 }}
        style={{ width: '1.2vh', height: '1.2vh', borderRadius: '50%' }}
      />
      <span style={{
        fontFamily: FONT_MONO,
        fontSize: '1.8vh',
        fontWeight: 700,
        color: active ? section.color : 'rgba(255,255,255,0.5)',
        letterSpacing: '0.08em',
      }}>
        {section.id}
      </span>
      <span style={{
        fontFamily: FONT_CHAT,
        fontSize: '2.2vh',
        fontWeight: 600,
        color: active ? WHITE : 'rgba(255,255,255,0.5)',
      }}>
        {section.label}
      </span>
    </motion.div>
  );
}

function RuleTag({ label, delay = 0, color = ACCENT }: { label: string; delay?: number; color?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: FONT_MONO,
        fontSize: '2vh',
        fontWeight: 700,
        padding: '0.5vh 1.2vh',
        borderRadius: 100,
        background: `${color}20`,
        border: `1px solid ${color}50`,
        color: color,
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </motion.span>
  );
}

const CLIP_CONFIG: Record<Clip, { startPhase: Phase; timers: { time: number; phase: Phase }[] }> = {
  all: {
    startPhase: 'receive',
    timers: [
      { time: 5000, phase: 'guardrails-tone' },
      { time: 12000, phase: 'work' },
      { time: 16000, phase: 'formatting' },
      { time: 25000, phase: 'fallback' },
      { time: 30000, phase: 'handback' },
    ],
  },
  c1: {
    startPhase: 'receive',
    timers: [
      { time: 5000, phase: 'guardrails-tone' },
    ],
  },
  c2: {
    startPhase: 'work',
    timers: [],
  },
  c3: {
    startPhase: 'formatting',
    timers: [],
  },
  c4: {
    startPhase: 'fallback',
    timers: [
      { time: 5000, phase: 'handback' },
    ],
  },
};

export function Scene8({ isPlaying = true, clip = 'all' }: Scene8Props) {
  const config = CLIP_CONFIG[clip];
  const [phase, setPhase] = useState<Phase>(config.startPhase);

  const timerEvents = useMemo(() =>
    config.timers.map(t => ({ time: t.time, callback: () => setPhase(t.phase) })),
  [config]);

  usePausableTimers(isPlaying, timerEvents);

  const activeSections = (() => {
    switch (phase) {
      case 'receive': return [] as string[];
      case 'guardrails-tone': return ['GRD', 'TONE'];
      case 'work': return ['GRD', 'TONE'];
      case 'formatting': return ['FMT'];
      case 'fallback': return ['FB'];
      case 'handback': return AGENT_SPEC_SECTIONS.map(s => s.id);
      default: return [] as string[];
    }
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
        width: '24%',
        padding: '5vh 2vh 5vh 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8vh',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.15)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: '2.4vh',
            fontWeight: 700,
            color: WHITE,
            marginBottom: '1vh',
            paddingBottom: '1vh',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
          Schedule Agent Spec
        </motion.div>
        {AGENT_SPEC_SECTIONS.map((section) => (
          <AgentSectionPill
            key={section.id}
            section={section}
            active={activeSections.includes(section.id)}
            dimmed={activeSections.length > 0 && !activeSections.includes(section.id)}
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
        <AnimatePresence mode="wait">
            <motion.div
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: '3.5vh',
                fontWeight: 800,
                color: WHITE,
                marginBottom: '8vh',
                textAlign: 'center',
                marginTop: '15vh',
                flexShrink: 0,
              }}
            >
              {phase === 'receive' && 'Agent Receives the Task'}
              {phase === 'guardrails-tone' && 'Guardrails & Tone'}
              {phase === 'work' && 'Agent Does Its Work'}
              {phase === 'formatting' && 'Response Formatting'}
              {phase === 'fallback' && 'Fallback Standing By'}
              {phase === 'handback' && 'Handback to Orchestrator'}
            </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginBottom: 'auto', minHeight: 0 }}>
          <AnimatePresence mode="wait">
            {phase === 'receive' && (
              <motion.div
                key="receive"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '3vw' }}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      padding: '2vh 3vh',
                      borderRadius: 16,
                      background: 'rgba(134,41,255,0.1)',
                      border: '2px solid rgba(134,41,255,0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: '2.4vh', color: WHITE, fontWeight: 700 }}>ORCHESTRATOR</div>
                  </motion.div>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5vh',
                    }}
                  >
                    <motion.div style={{
                      width: '12vw',
                      height: '2px',
                      background: `linear-gradient(90deg, ${ACCENT_PURPLE}, ${ACCENT})`,
                      transformOrigin: 'left',
                    }} />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 1.2 }}
                      style={{ fontFamily: FONT_MONO, fontSize: '1.8vh', color: WHITE_DIM }}
                    >
                      context bundle
                    </motion.span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    style={{
                      padding: '2vh 3vh',
                      borderRadius: 16,
                      background: 'rgba(56,189,248,0.1)',
                      border: '2px solid rgba(56,189,248,0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: '2.4vh', color: WHITE, fontWeight: 700 }}>SCHEDULE AGENT</div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  style={{
                    padding: '1.5vh 3vh',
                    borderRadius: 12,
                    background: 'rgba(56,189,248,0.06)',
                    border: '1px solid rgba(56,189,248,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1vh',
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '2vh',
                      height: '2vh',
                      border: '2px solid transparent',
                      borderTopColor: ACCENT,
                      borderRadius: '50%',
                    }}
                  />
                  <span className="text-[28px]" style={{ fontFamily: FONT_CHAT, color: WHITE_BODY }}>
                    Loading AgentBehavior.md — the agent has its own rules
                  </span>
                </motion.div>
              </motion.div>
            )}

            {phase === 'guardrails-tone' && (
              <motion.div
                key="guardrails-tone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}
              >
                <div style={{ display: 'flex', gap: '2vw' }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      flex: 1,
                      padding: '2vh',
                      borderRadius: 14,
                      background: 'rgba(239,68,68,0.06)',
                      border: '1.5px solid rgba(239,68,68,0.25)',
                    }}
                  >
                    <div style={{
                      fontFamily: FONT_MONO,
                      fontSize: '2.2vh',
                      fontWeight: 700,
                      color: '#F87171',
                      marginBottom: '1.2vh',
                    }}>GUARDRAILS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
                      {[
                        { rule: 'GRD-07', text: 'Never fabricate data' },
                        { rule: 'GRD-12', text: 'Approved links only' },
                        { rule: 'GRD-13', text: 'No system details' },
                      ].map(({ rule, text }, i) => (
                        <motion.div
                          key={rule}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.3 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1vh',
                            fontFamily: FONT_CHAT,
                            fontSize: '2.2vh',
                            color: WHITE_BODY,
                          }}
                        >
                          <RuleTag label={rule} delay={0.4 + i * 0.3} color="#F87171" />
                          <span>{text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      flex: 1,
                      padding: '2vh',
                      borderRadius: 14,
                      background: 'rgba(16,185,129,0.06)',
                      border: '1.5px solid rgba(16,185,129,0.25)',
                    }}
                  >
                    <div style={{
                      fontFamily: FONT_MONO,
                      fontSize: '2.2vh',
                      fontWeight: 700,
                      color: '#34D399',
                      marginBottom: '1.2vh',
                    }}>TONE & VOICE</div>
                    <div style={{ display: 'flex', gap: '1vh', flexWrap: 'wrap', marginTop: '0.5vh' }}>
                      {['Empowering', 'Effortless', 'Grounded', 'Supportive'].map((quality, i) => (
                        <motion.span
                          key={quality}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.2 }}
                          style={{
                            fontFamily: FONT_CHAT,
                            fontSize: '2vh',
                            fontWeight: 700,
                            padding: '0.6vh 1.4vh',
                            borderRadius: 8,
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.2)',
                            color: WHITE_BODY,
                          }}
                        >
                          {quality}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {phase === 'work' && (
              <motion.div
                key="work"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2vw',
                    padding: '2vh 4vh',
                    borderRadius: 16,
                    background: 'rgba(56,189,248,0.06)',
                    border: '1.5px solid rgba(56,189,248,0.2)',
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: 2, ease: 'linear' }}
                    style={{
                      width: '3vh',
                      height: '3vh',
                      border: '2px solid transparent',
                      borderTopColor: ACCENT,
                      borderRightColor: ACCENT,
                      borderRadius: '50%',
                    }}
                  />
                  <span style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_BODY }}>
                    Querying shift data for next month...
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  style={{
                    padding: '2vh 3vh',
                    borderRadius: 14,
                    background: 'rgba(16,185,129,0.08)',
                    border: '1.5px solid rgba(16,185,129,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5vh',
                  }}
                >
                  <svg width="3vh" height="3vh" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="2" />
                    <path d="M7 13l3 3 7-7" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', fontWeight: 700, color: '#34D399' }}>
                    Coverage is handled — shifts are filled
                  </span>
                </motion.div>
              </motion.div>
            )}

            {phase === 'formatting' && (
              <motion.div
                key="formatting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}
              >
                <div style={{ display: 'flex', gap: '1.5vw', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { rule: 'FMT-01', text: '1-2 sentences' },
                    { rule: 'FMT-03', text: 'Summary first' },
                    { rule: 'FMT-04', text: 'Always a next step' },
                  ].map(({ rule, text }, i) => (
                    <motion.div
                      key={rule}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.4 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8vh',
                        padding: '1vh 1.8vh',
                        borderRadius: 10,
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.25)',
                      }}
                    >
                      <RuleTag label={rule} delay={0.3 + i * 0.4} color="#818CF8" />
                      <span style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_BODY }}>{text}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.2vh',
                    maxWidth: '85%',
                    alignSelf: 'center',
                  }}
                >
                  <div style={{
                    width: '4vh',
                    height: '4vh',
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
                    padding: '2vh 3vh',
                    borderRadius: '20px',
                    borderTopLeftRadius: '5px',
                    background: 'rgba(134,41,255,0.12)',
                    border: '1px solid rgba(134,41,255,0.25)',
                    fontFamily: FONT_CHAT,
                    fontSize: '2.4vh',
                    lineHeight: 1.6,
                    color: WHITE_BODY,
                  }}>
                    Your team's shifts are covered for the week you're looking at. Want me to go ahead and submit your leave request?
                  </div>
                </motion.div>

              </motion.div>
            )}

            {phase === 'fallback' && (
              <motion.div
                key="fallback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5vh',
                  maxWidth: '55vw',
                }}>
                  {[
                    { rule: 'FB-05', text: 'Auto-retry with progress', color: '#F472B6' },
                    { rule: 'FB-02', text: 'Error recovery', color: '#F472B6' },
                    { rule: 'FB-13', text: 'Loop detection', color: '#F472B6' },
                    { rule: 'FB-16', text: 'Module not available', color: '#F472B6' },
                  ].map(({ rule, text, color }, i) => (
                    <motion.div
                      key={rule}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.25 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1vh',
                        padding: '1.2vh 2vh',
                        borderRadius: 10,
                        background: 'rgba(236,72,153,0.06)',
                        border: '1px solid rgba(236,72,153,0.2)',
                      }}
                    >
                      <RuleTag label={rule} delay={0.3 + i * 0.25} color={color} />
                      <span style={{ fontFamily: FONT_CHAT, fontSize: '2.2vh', color: WHITE_BODY }}>{text}</span>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            )}

            {phase === 'handback' && (
              <motion.div
                key="handback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2vw' }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      padding: '1.5vh 2.5vh',
                      borderRadius: 14,
                      background: 'rgba(56,189,248,0.1)',
                      border: '1.5px solid rgba(56,189,248,0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: '2.4vh', color: WHITE, fontWeight: 700 }}>SCHEDULE AGENT</div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      style={{ fontFamily: FONT_MONO, fontSize: '2vh', color: '#34D399', fontWeight: 700, marginTop: '0.3vh' }}
                    >
                      ✓ COMPLETE
                    </motion.div>
                  </motion.div>

                  <div style={{ position: 'relative', width: '6vw', height: '2px' }}>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                      style={{
                        width: '100%',
                        height: '2px',
                        background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_PURPLE})`,
                        transformOrigin: 'left',
                      }}
                    />
                    <motion.div
                      initial={{ left: '0%', opacity: 0 }}
                      animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                      transition={{ delay: 1.7, duration: 0.6, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: ACCENT,
                        boxShadow: `0 0 12px ${ACCENT}`,
                      }}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{
                      padding: '1.5vh 2.5vh',
                      borderRadius: 14,
                      background: 'rgba(134,41,255,0.1)',
                      border: '1.5px solid rgba(134,41,255,0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: '2.4vh', color: WHITE, fontWeight: 700 }}>ORCHESTRATOR</div>
                  </motion.div>

                  <div style={{ position: 'relative', width: '6vw', height: '2px' }}>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 2.5, duration: 0.5 }}
                      style={{
                        width: '100%',
                        height: '2px',
                        background: `linear-gradient(90deg, ${ACCENT_PURPLE}, #FBBF24)`,
                        transformOrigin: 'left',
                      }}
                    />
                    <motion.div
                      initial={{ left: '0%', opacity: 0 }}
                      animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                      transition={{ delay: 3.0, duration: 0.6, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#FBBF24',
                        boxShadow: '0 0 12px #FBBF24',
                      }}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.2, type: 'spring', stiffness: 200 }}
                    style={{
                      padding: '1.5vh 2.5vh',
                      borderRadius: 14,
                      background: 'rgba(245,158,11,0.1)',
                      border: '2px solid rgba(245,158,11,0.4)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: '2.4vh', color: WHITE, fontWeight: 700 }}>TIME OFF AGENT</div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.8 }}
                      style={{ fontFamily: FONT_MONO, fontSize: '2vh', color: '#FBBF24', fontWeight: 700, marginTop: '0.3vh' }}
                    >
                      ● ACTIVE
                    </motion.div>
                  </motion.div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
