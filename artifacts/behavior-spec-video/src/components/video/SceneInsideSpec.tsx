import { motion, LayoutGroup } from 'framer-motion';
import { useState, useMemo } from 'react';
import { usePausableTimers } from '@/lib/video';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

const ACCENT = '#60CDFF';
const ACCENT_PURPLE = '#A855F7';
const WHITE = '#ffffff';
const WHITE_DIM = 'rgba(255,255,255,0.88)';

interface SceneInsideSpecProps {
  isPlaying?: boolean;
}

type RuleTarget = 'orchestrator' | 'agent' | 'both';

const SPEC_SECTIONS = [
  { id: 'GRD', label: 'Guardrails & Safety', color: '#f87171', count: 14, desc: 'What the AI must never do',
    rules: [
      { id: 'GRD-01', target: 'orchestrator' as RuleTarget },
      { id: 'GRD-02', target: 'orchestrator' as RuleTarget },
      { id: 'GRD-03', target: 'orchestrator' as RuleTarget },
      { id: 'GRD-04', target: 'both' as RuleTarget },
      { id: 'GRD-05', target: 'both' as RuleTarget },
      { id: 'GRD-06', target: 'orchestrator' as RuleTarget },
      { id: 'GRD-07', target: 'agent' as RuleTarget },
      { id: 'GRD-08', target: 'orchestrator' as RuleTarget },
      { id: 'GRD-09', target: 'both' as RuleTarget },
      { id: 'GRD-10', target: 'orchestrator' as RuleTarget },
      { id: 'GRD-11', target: 'agent' as RuleTarget },
      { id: 'GRD-12', target: 'orchestrator' as RuleTarget },
      { id: 'GRD-13', target: 'both' as RuleTarget },
      { id: 'GRD-14', target: 'orchestrator' as RuleTarget },
    ] },
  { id: 'ID', label: 'Intent Detection', color: '#fbbf24', count: 5, desc: 'How to interpret what the user wants',
    rules: [
      { id: 'ID-01', target: 'orchestrator' as RuleTarget },
      { id: 'ID-02', target: 'orchestrator' as RuleTarget },
      { id: 'ID-03', target: 'orchestrator' as RuleTarget },
      { id: 'ID-04', target: 'both' as RuleTarget },
      { id: 'ID-05', target: 'orchestrator' as RuleTarget },
    ] },
  { id: 'MEM', label: 'Conversation Memory', color: '#c084fc', count: 7, desc: 'What to remember across turns',
    rules: [
      { id: 'MEM-01', target: 'orchestrator' as RuleTarget },
      { id: 'MEM-02', target: 'both' as RuleTarget },
      { id: 'MEM-03', target: 'orchestrator' as RuleTarget },
      { id: 'MEM-04', target: 'orchestrator' as RuleTarget },
      { id: 'MEM-05', target: 'both' as RuleTarget },
      { id: 'MEM-06', target: 'orchestrator' as RuleTarget },
      { id: 'MEM-07', target: 'orchestrator' as RuleTarget },
    ] },
  { id: 'CTX', label: 'Context Management', color: '#22d3ee', count: 8, desc: 'What context to pass on handoff',
    rules: [
      { id: 'CTX-01', target: 'orchestrator' as RuleTarget },
      { id: 'CTX-02', target: 'orchestrator' as RuleTarget },
      { id: 'CTX-03', target: 'both' as RuleTarget },
      { id: 'CTX-04', target: 'orchestrator' as RuleTarget },
      { id: 'CTX-05', target: 'orchestrator' as RuleTarget },
      { id: 'CTX-06', target: 'both' as RuleTarget },
      { id: 'CTX-07', target: 'orchestrator' as RuleTarget },
      { id: 'CTX-08', target: 'orchestrator' as RuleTarget },
    ] },
  { id: 'TONE', label: 'Tone & Personality', color: '#34d399', count: 2, desc: 'How the AI sounds and feels',
    rules: [
      { id: 'TN-01', target: 'agent' as RuleTarget },
      { id: 'TN-02', target: 'both' as RuleTarget },
    ] },
  { id: 'FMT', label: 'Response Formatting', color: '#818cf8', count: 12, desc: 'How answers are structured',
    rules: [
      { id: 'FMT-01', target: 'both' as RuleTarget },
      { id: 'FMT-02', target: 'both' as RuleTarget },
      { id: 'FMT-03', target: 'agent' as RuleTarget },
      { id: 'FMT-04', target: 'agent' as RuleTarget },
      { id: 'FMT-05', target: 'agent' as RuleTarget },
      { id: 'FMT-06', target: 'both' as RuleTarget },
      { id: 'FMT-07', target: 'agent' as RuleTarget },
      { id: 'FMT-08', target: 'agent' as RuleTarget },
      { id: 'FMT-09', target: 'both' as RuleTarget },
      { id: 'FMT-10', target: 'agent' as RuleTarget },
      { id: 'FMT-11', target: 'agent' as RuleTarget },
      { id: 'FMT-12', target: 'both' as RuleTarget },
    ] },
  { id: 'FB', label: 'Fallback & Recovery', color: '#f472b6', count: 16, desc: 'What to do when things go wrong',
    rules: [
      { id: 'FB-01', target: 'orchestrator' as RuleTarget },
      { id: 'FB-02', target: 'agent' as RuleTarget },
      { id: 'FB-03', target: 'both' as RuleTarget },
      { id: 'FB-04', target: 'agent' as RuleTarget },
      { id: 'FB-05', target: 'orchestrator' as RuleTarget },
      { id: 'FB-06', target: 'agent' as RuleTarget },
      { id: 'FB-07', target: 'both' as RuleTarget },
      { id: 'FB-08', target: 'orchestrator' as RuleTarget },
      { id: 'FB-09', target: 'agent' as RuleTarget },
      { id: 'FB-10', target: 'both' as RuleTarget },
      { id: 'FB-11', target: 'agent' as RuleTarget },
      { id: 'FB-12', target: 'orchestrator' as RuleTarget },
      { id: 'FB-13', target: 'agent' as RuleTarget },
      { id: 'FB-14', target: 'both' as RuleTarget },
      { id: 'FB-15', target: 'orchestrator' as RuleTarget },
      { id: 'FB-16', target: 'agent' as RuleTarget },
    ] },
  { id: 'RT', label: 'Agent Routing', color: ACCENT, count: 6, desc: 'How to choose the right agent',
    rules: [
      { id: 'RT-01', target: 'orchestrator' as RuleTarget },
      { id: 'RT-02', target: 'orchestrator' as RuleTarget },
      { id: 'RT-03', target: 'orchestrator' as RuleTarget },
      { id: 'RT-04', target: 'both' as RuleTarget },
      { id: 'RT-05', target: 'orchestrator' as RuleTarget },
      { id: 'RT-06', target: 'both' as RuleTarget },
    ] },
];

interface SortedRule {
  id: string;
  target: RuleTarget;
  color: string;
  sectionId: string;
}

const ORCH_RULES: SortedRule[] = SPEC_SECTIONS.flatMap(s =>
  s.rules.filter(r => r.target === 'orchestrator' || r.target === 'both')
    .map(r => ({ ...r, color: s.color, sectionId: s.id }))
);
const AGENT_RULES: SortedRule[] = SPEC_SECTIONS.flatMap(s =>
  s.rules.filter(r => r.target === 'agent' || r.target === 'both')
    .map(r => ({ ...r, color: s.color, sectionId: s.id }))
);

type Phase = 'spec' | 'tagline';

const TAG_STYLE = {
  fontFamily: FONT_MONO,
  fontSize: '1.3vh',
  fontWeight: 700 as const,
  padding: '0.3vh 0.8vh',
  borderRadius: 100,
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap' as const,
  zIndex: 10,
};

function makeTagStyle(color: string) {
  return {
    ...TAG_STYLE,
    background: `${color}20`,
    border: `1px solid ${color}50`,
    color: color,
  };
}

type SortPhase = 'none' | 'orch' | 'agent';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const AGENT_DISPERSED_POSITIONS = (() => {
  const rng = seededRandom(42);
  const positions: Record<string, { x: number; y: number }> = {};
  const placed: { x: number; y: number }[] = [];
  AGENT_RULES.forEach((rule) => {
    let x: number, y: number;
    let attempts = 0;
    do {
      x = 5 + rng() * 85;
      y = 8 + rng() * 75;
      attempts++;
    } while (
      attempts < 50 &&
      placed.some(p => Math.abs(p.x - x) < 8 && Math.abs(p.y - y) < 6)
    );
    placed.push({ x, y });
    positions[`${rule.id}-agent`] = { x, y };
  });
  return positions;
})();

export function SceneInsideSpec({ isPlaying = true }: SceneInsideSpecProps) {
  const [phase, setPhase] = useState<Phase>('spec');
  const [showCards, setShowCards] = useState(true);
  const [sortPhase, setSortPhase] = useState<SortPhase>('none');

  const timerEvents = useMemo(() => [
    { time: 23000, callback: () => { setShowCards(false); setSortPhase('orch'); } },
    { time: 29000, callback: () => { setSortPhase('agent'); } },
  ], []);

  usePausableTimers(isPlaying, timerEvents);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ fontFamily: FONT_CHAT, overflow: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {phase === 'spec' && (
        <LayoutGroup>
          <motion.div
            key="spec"
            className="absolute inset-0"
            style={{ padding: '90px 5% 4vh 5%', display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5vh',
              position: 'relative',
            }}>
              <motion.h2
                animate={{ opacity: showCards ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '4vh',
                  fontWeight: 800,
                  color: WHITE,
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                Inside the Spec
              </motion.h2>
              <motion.div
                animate={{ opacity: !showCards ? 1 : 0 }}
                transition={{ duration: 0.5, delay: !showCards ? 0.3 : 0 }}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '4vh',
                  fontWeight: 800,
                  color: '#ffffff',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  textAlign: 'center',
                }}>
                At runtime, rules route to&hellip;
              </motion.div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2vh',
                alignContent: 'start',
                width: '100%',
              }}>
                {SPEC_SECTIONS.map((section, i) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.5, type: 'spring', stiffness: 150, damping: 20 }}
                    style={{
                      padding: '1.8vh 1.8vh',
                      borderRadius: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5vh',
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      animate={{
                        opacity: showCards ? 1 : 0,
                      }}
                      transition={{ duration: 0.8 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 16,
                        background: `${section.color}10`,
                        border: `1.5px solid ${section.color}40`,
                        pointerEvents: 'none',
                      }}
                    />

                    <motion.div
                      animate={{ opacity: showCards ? 1 : 0 }}
                      transition={{ duration: 0.6 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1vh', width: '100%' }}>
                        <div style={{
                          width: '1.4vh',
                          height: '1.4vh',
                          borderRadius: '50%',
                          background: section.color,
                          flexShrink: 0,
                        }} />
                        <span style={{
                          fontFamily: FONT_MONO,
                          fontSize: '1.8vh',
                          fontWeight: 700,
                          color: section.color,
                          letterSpacing: '0.08em',
                        }}>
                          {section.id}
                        </span>
                        <span style={{
                          fontFamily: FONT_MONO,
                          fontSize: '1.4vh',
                          color: WHITE,
                          marginLeft: 'auto',
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                        }}>
                          {section.count} rules
                        </span>
                      </div>
                      <span style={{
                        fontFamily: FONT_CHAT,
                        fontSize: '2.4vh',
                        fontWeight: 600,
                        color: WHITE,
                      }}>
                        {section.label}
                      </span>
                      <span style={{
                        fontFamily: FONT_CHAT,
                        fontSize: '1.4vh',
                        color: WHITE_DIM,
                        lineHeight: 1.4,
                      }}>
                        {section.desc}
                      </span>
                    </motion.div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5vh', marginTop: '0.4vh', position: 'relative' }}>
                      {section.rules.map((rule, ri) => {
                        if (sortPhase !== 'none') return null;
                        const primaryId = (rule.target === 'agent') ? `tag-${rule.id}-agent` : `tag-${rule.id}-orch`;
                        return (
                          <div key={rule.id} style={{ position: 'relative' }}>
                            <motion.span
                              layoutId={primaryId}
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.2 + i * 0.15 + ri * 0.08, duration: 0.3 }}
                              style={makeTagStyle(section.color)}
                            >
                              {rule.id}
                            </motion.span>
                            {rule.target === 'both' && (
                              <motion.span
                                layoutId={`tag-${rule.id}-agent`}
                                style={{
                                  ...makeTagStyle(section.color),
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  opacity: 0.6,
                                }}
                              >
                                {rule.id}
                              </motion.span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {(sortPhase === 'orch' || sortPhase === 'agent') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    gap: '3vh',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    padding: '90px 5% 3vh 5%',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
                    style={{
                      width: '45%',
                      minHeight: '50vh',
                      padding: '2.5vh 2.5vh',
                      borderRadius: 18,
                      background: 'rgba(168,85,247,0.08)',
                      border: '2px solid rgba(168,85,247,0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2vh',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.8vh',
                    }}>
                      <div style={{
                        width: '5vh',
                        height: '5vh',
                        borderRadius: '14%',
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(168,85,247,0.08))',
                        border: '2px solid rgba(168,85,247,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{
                          fontFamily: FONT_DISPLAY,
                          fontSize: '2.8vh',
                          fontWeight: 800,
                          color: ACCENT_PURPLE,
                        }}>O</span>
                      </div>
                      <span style={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: '2.8vh',
                        fontWeight: 800,
                        color: WHITE,
                      }}>Orchestrator</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8vh', alignContent: 'flex-start', flex: 1 }}>
                      {ORCH_RULES.map((rule) => (
                        <motion.span
                          key={`orch-${rule.id}`}
                          layoutId={`tag-${rule.id}-orch`}
                          layout="position"
                          transition={{
                            layout: { duration: 1.2, type: 'spring', stiffness: 50, damping: 14 },
                          }}
                          style={makeTagStyle(rule.color)}
                        >
                          {rule.id}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {sortPhase === 'orch' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                      }}
                    >
                      {AGENT_RULES.map((rule) => {
                        const pos = AGENT_DISPERSED_POSITIONS[`${rule.id}-agent`] || { x: 50, y: 50 };
                        return (
                          <motion.span
                            key={`floating-agent-${rule.id}`}
                            layoutId={`tag-${rule.id}-agent`}
                            layout="position"
                            transition={{
                              layout: { duration: 1.2, type: 'spring', stiffness: 50, damping: 14 },
                            }}
                            style={{
                              ...makeTagStyle(rule.color),
                              position: 'absolute',
                              left: `${pos.x}%`,
                              top: `${pos.y}%`,
                              opacity: 0.4,
                            }}
                          >
                            {rule.id}
                          </motion.span>
                        );
                      })}
                    </div>
                  )}

                  {sortPhase === 'agent' && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
                    style={{
                      width: '45%',
                      minHeight: '50vh',
                      padding: '2.5vh 2.5vh',
                      borderRadius: 18,
                      background: `${ACCENT}14`,
                      border: `2px solid ${ACCENT}59`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2vh',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.8vh',
                    }}>
                      <div style={{
                        width: '5vh',
                        height: '5vh',
                        borderRadius: '14%',
                        background: `linear-gradient(135deg, ${ACCENT}40, ${ACCENT}14)`,
                        border: `2px solid ${ACCENT}80`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{
                          fontFamily: FONT_DISPLAY,
                          fontSize: '2.8vh',
                          fontWeight: 800,
                          color: ACCENT,
                        }}>A</span>
                      </div>
                      <span style={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: '2.8vh',
                        fontWeight: 800,
                        color: WHITE,
                      }}>Agent</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8vh', alignContent: 'flex-start' }}>
                      {AGENT_RULES.map((rule) => (
                        <motion.span
                          key={`agent-${rule.id}`}
                          layoutId={`tag-${rule.id}-agent`}
                          layout="position"
                          transition={{
                            layout: { duration: 1.2, type: 'spring', stiffness: 50, damping: 14 },
                          }}
                          style={makeTagStyle(rule.color)}
                        >
                          {rule.id}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                  )}
                </motion.div>
              )}
            </div>

          </motion.div>
        </LayoutGroup>
      )}
    </motion.div>
  );
}
