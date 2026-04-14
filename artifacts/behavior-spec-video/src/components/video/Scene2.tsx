import { motion, AnimatePresence } from 'framer-motion';
import { usePausableTypewriter } from '@/lib/video';
import { useEffect, useState, useRef } from 'react';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const BRYTE_LOGO_PATH_OUTER = "M27.6928 6.86067C27.4119 7.75951 27.1785 9.53921 27.8269 11.1042L27.8269 11.1041C28.4622 12.6376 29.8419 13.7183 30.6821 14.1724C30.7254 14.1868 30.7685 14.2029 30.8114 14.2207C31.5741 14.5365 32.0257 15.2861 31.9989 16.0651C31.9743 16.7964 31.5315 17.4812 30.8113 17.7795C30.7685 17.7972 30.7253 17.8133 30.682 17.8278C29.8418 18.2818 28.4621 19.3625 27.8268 20.896L27.8268 20.896C27.1785 22.4609 27.4118 24.2405 27.6927 25.1393C27.9099 25.6098 27.9375 26.1661 27.7235 26.6826C27.6434 26.876 27.5354 27.0493 27.4061 27.2C27.2155 27.4225 26.9709 27.6047 26.6816 27.7246C26.164 27.9389 25.6064 27.9108 25.1352 27.6924C24.2353 27.412 22.4576 27.1799 20.8941 27.8273L20.8941 27.8273C19.3669 28.4599 18.2886 29.8305 17.8312 30.6715C17.6628 31.1873 17.2784 31.6292 16.7377 31.8531C16.4902 31.9556 16.2336 32.0026 15.9816 32C15.7415 31.9979 15.4977 31.9506 15.2623 31.853C14.7217 31.6292 14.3373 31.1874 14.1689 30.6717C13.7115 29.8307 12.6332 28.4599 11.1059 27.8274L11.1059 27.8273C9.54256 27.1799 7.76499 27.412 6.86503 27.6923C6.3938 27.9108 5.83611 27.939 5.3184 27.7246C5.02629 27.6036 4.77981 27.4191 4.58837 27.1936C4.46152 27.0444 4.35545 26.8732 4.27649 26.6826C4.0625 26.1661 4.09015 25.6098 4.3074 25.1392C4.58821 24.2403 4.82146 22.4608 4.1732 20.896L4.17319 20.8961C3.53792 19.3626 2.1582 18.2819 1.31802 17.8278C1.27468 17.8134 1.23155 17.7973 1.18869 17.7795C0.468362 17.4812 0.0254892 16.7961 0.00111517 16.0646C-0.0255076 15.2857 0.426109 14.5365 1.18864 14.2207C1.23149 14.2029 1.27463 14.1868 1.31796 14.1724C2.15814 13.7183 3.53786 12.6376 4.17314 11.1041L4.17315 11.1042C4.82141 9.53938 4.58816 7.75988 4.30734 6.86095C4.09009 6.39043 4.06244 5.8341 4.27644 5.31756C4.35591 5.12572 4.46284 4.95356 4.59078 4.80375C4.78187 4.57957 5.02749 4.39604 5.31834 4.27559C5.83606 4.06118 6.39374 4.08939 6.86497 4.30787C7.76493 4.58823 9.54251 4.82026 11.1058 4.17286L11.1058 4.17282C12.6334 3.54018 13.7118 2.16918 14.169 1.32821C14.3375 0.812581 14.7218 0.370903 15.2624 0.147041C15.7444 -0.0525455 16.2556 -0.0524798 16.7377 0.147041C17.2783 0.370879 17.6626 0.81249 17.8311 1.32812C18.2883 2.16909 19.3666 3.54018 20.894 4.17283L20.8941 4.17286C22.4575 4.82026 24.2351 4.58823 25.1351 4.30787C25.6063 4.0894 26.1639 4.06119 26.6816 4.27559C26.9709 4.39604 27.2154 4.57835 27.4062 4.80135C27.5362 4.95164 27.6436 5.12464 27.7236 5.31756C27.9375 5.83388 27.9099 6.39005 27.6928 6.86041L27.6928 6.86067Z";
const BRYTE_LOGO_PATH_SMILE = "M10.9707 16.5885C11.5954 16.1368 12.468 16.2771 12.9196 16.9018C13.6019 17.8455 14.7237 18.4641 15.9992 18.4641C17.2747 18.4641 18.3965 17.8455 19.0787 16.9018C19.5304 16.2771 20.403 16.1368 21.0277 16.5885C21.6524 17.0402 21.7927 17.9127 21.341 18.5374C20.1501 20.1846 18.1981 21.2557 15.9992 21.2557C13.8003 21.2557 11.8482 20.1846 10.6573 18.5374C10.2057 17.9127 10.346 17.0402 10.9707 16.5885Z";

function BryteLogo({ size = 28, id = 'logo' }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d={BRYTE_LOGO_PATH_OUTER} fill={`url(#${id})`} />
      <path fillRule="evenodd" clipRule="evenodd" d={BRYTE_LOGO_PATH_SMILE} fill="#743DB0" />
      <defs>
        <linearGradient id={id} x1="9.92" y1="1.12" x2="21.8" y2="29.998" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6DAAF2" />
          <stop offset="0.75" stopColor="#5F249F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const fullText = "Help me request leave for next month without messing up coverage";

const DEFINITION_END = 12000;
const SPEC_CARDS_START = 12000;
const CARD_STAGGER = 350;
const TRANSITION_TO_CHAT = 35000;
const TYPING_START_DELAY = 39000;

const SPEC_SECTIONS = [
  { title: 'Intent Detection', subtitle: '8 rules' },
  { title: 'Routing', subtitle: '6 rules' },
  { title: 'Context Management', subtitle: '8 rules' },
  { title: 'Memory', subtitle: '7 rules' },
  { title: 'Guardrails', subtitle: '14 rules' },
  { title: 'Tone', subtitle: '2 rules' },
  { title: 'Response Formatting', subtitle: '12 rules' },
  { title: 'Fallback & Recovery', subtitle: '16 rules' },
];


function useSceneElapsed(isPlaying: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      if (startRef.current !== null) {
        accumulatedRef.current += performance.now() - startRef.current;
        startRef.current = null;
      }
      return;
    }

    startRef.current = performance.now();
    let raf: number;
    const tick = () => {
      const now = performance.now();
      setElapsed(accumulatedRef.current + (now - (startRef.current || now)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  return elapsed;
}

const SPEC_CARD_SHIMMER_TIMES = [
  14700,
  15500,
  16300,
  17800,
  18600,
  19300,
  20000,
  21500,
];
const SPEC_CARD_SHIMMER_DUR = 1200;

function SpecCard({ section, index, elapsed }: {
  section: typeof SPEC_SECTIONS[0];
  index: number;
  elapsed: number;
}) {
  const shimmerStart = SPEC_CARD_SHIMMER_TIMES[index] ?? 15000;
  const shimmerActive = elapsed >= shimmerStart && elapsed < shimmerStart + SPEC_CARD_SHIMMER_DUR;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        padding: '1.5vh 1.5vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2vh',
      }}
    >
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: '28px',
        color: '#fff',
        lineHeight: 1.2,
      }}>
        {section.title}
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '24px',
        color: '#ffffff',
        opacity: 0.85,
      }}>
        {section.subtitle}
      </div>
      <motion.div
        initial={{ width: 30, opacity: 0.4, boxShadow: '0 0 0px rgba(134,41,255,0)' }}
        animate={shimmerActive ? {
          width: 50,
          opacity: 1,
          boxShadow: '0 0 10px rgba(134,41,255,0.5), 0 0 20px rgba(56,189,248,0.3)',
        } : {
          width: 30,
          opacity: 0.4,
          boxShadow: '0 0 0px rgba(134,41,255,0)',
        }}
        transition={{ duration: shimmerActive ? 0.4 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 3,
          borderRadius: 2,
          background: shimmerActive
            ? 'linear-gradient(90deg, #8629FF, #38BDF8, #8629FF)'
            : 'linear-gradient(90deg, #8629FF, #38BDF8)',
          backgroundSize: shimmerActive ? '200% 100%' : '100% 100%',
          animation: shimmerActive ? 'schemaLineShimmer 0.8s ease-in-out' : 'none',
          marginTop: '0.2vh',
        }}
      />
    </div>
  );
}

function SpecDocument({ elapsed }: { elapsed: number }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2vh',
      height: '100%',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1vh',
          marginBottom: '0.5vh',
        }}
      >
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: '40px',
            color: '#fff',
          }}>
          Bryte Behavior Spec
        </div>
      </motion.div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.8vh',
        flex: 1,
      }}>
        {SPEC_SECTIONS.map((section, i) => (
          <SpecCard
            key={section.title}
            section={section}
            index={i}
            elapsed={elapsed}
          />
        ))}
      </div>
    </div>
  );
}

type RuleTarget = 'orchestrator' | 'agent' | 'both';

interface SortableRule {
  id: string;
  target: RuleTarget;
  color: string;
  sectionLabel: string;
}

const SORTABLE_RULES: SortableRule[] = [
  { id: 'GRD-04', target: 'orchestrator', color: '#EF4444', sectionLabel: 'Guardrails' },
  { id: 'GRD-06', target: 'both', color: '#EF4444', sectionLabel: 'Guardrails' },
  { id: 'GRD-09', target: 'both', color: '#EF4444', sectionLabel: 'Guardrails' },
  { id: 'GRD-11', target: 'agent', color: '#EF4444', sectionLabel: 'Guardrails' },
  { id: 'TONE', target: 'agent', color: '#8B5CF6', sectionLabel: 'Tone' },
  { id: 'Voice', target: 'agent', color: '#8B5CF6', sectionLabel: 'Tone' },
  { id: 'FMT-01', target: 'both', color: '#3B82F6', sectionLabel: 'Formatting' },
  { id: 'FMT-03', target: 'both', color: '#3B82F6', sectionLabel: 'Formatting' },
  { id: 'FMT-06', target: 'agent', color: '#3B82F6', sectionLabel: 'Formatting' },
  { id: 'FB-01', target: 'orchestrator', color: '#10B981', sectionLabel: 'Fallback' },
  { id: 'FB-05', target: 'both', color: '#10B981', sectionLabel: 'Fallback' },
  { id: 'FB-09', target: 'orchestrator', color: '#10B981', sectionLabel: 'Fallback' },
  { id: 'FB-16', target: 'agent', color: '#10B981', sectionLabel: 'Fallback' },
];

const ORCH_SORTED = SORTABLE_RULES.filter(r => r.target === 'orchestrator' || r.target === 'both');
const AGENT_SORTED = SORTABLE_RULES.filter(r => r.target === 'agent' || r.target === 'both');

function RuleSortPanel() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      gap: '2vh',
      padding: '1vh 0',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.3vh',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.15em',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        Rules route to&hellip;
      </motion.div>

      <div style={{ display: 'flex', gap: '2vh', flex: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 120 }}
          style={{
            flex: 1,
            padding: '2vh 2vh',
            borderRadius: 16,
            background: 'rgba(168,85,247,0.08)',
            border: '2px solid rgba(168,85,247,0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5vh',
          }}
        >
          <div style={{
            paddingBottom: '1vh',
            borderBottom: '1px solid rgba(168,85,247,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.8vh',
          }}>
            <div style={{
              width: '4vh',
              height: '4vh',
              borderRadius: '14%',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(168,85,247,0.08))',
              border: '2px solid rgba(168,85,247,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '2.2vh',
                fontWeight: 800,
                color: '#A855F7',
              }}>o</span>
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2.2vh',
              fontWeight: 800,
              color: '#fff',
            }}>Orchestrator</span>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.4vh',
              color: 'rgba(168,85,247,0.7)',
            }}>single source</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6vh' }}>
            {ORCH_SORTED.map((rule, i) => (
              <motion.span
                key={`orch-${rule.id}`}
                initial={{ opacity: 0, y: -40, x: (i % 2 === 0 ? 20 : -20), scale: 0.5 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                transition={{
                  delay: 1.2 + i * 0.15,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 120,
                  damping: 14,
                }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '1.3vh',
                  fontWeight: 700,
                  padding: '0.3vh 0.8vh',
                  borderRadius: 100,
                  background: `${rule.color}18`,
                  border: `1px solid ${rule.color}45`,
                  color: rule.color,
                  letterSpacing: '0.04em',
                }}
              >
                {rule.id}
                {rule.target === 'both' && (
                  <span style={{ marginLeft: '0.3vh', fontSize: '1.1vh', opacity: 0.6 }}>&#x2194;</span>
                )}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 3.0 }}
            style={{
              fontFamily: FONT_CHAT,
              fontSize: '1.2vh',
              color: 'rgba(255,255,255,0.5)',
              marginTop: 'auto',
            }}
          >
            Safety &middot; Intent &middot; Memory &middot; Routing
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 120 }}
          style={{
            flex: 1,
            padding: '2vh 2vh',
            borderRadius: 16,
            background: 'rgba(96,205,255,0.06)',
            border: '2px solid rgba(96,205,255,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5vh',
          }}
        >
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '2.2vh',
            fontWeight: 800,
            color: '#60CDFF',
            paddingBottom: '1vh',
            borderBottom: '1px solid rgba(96,205,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8vh',
          }}>
            <div style={{
              width: '1.2vh',
              height: '1.2vh',
              borderRadius: '50%',
              background: '#60CDFF',
              boxShadow: '0 0 8px rgba(96,205,255,0.6)',
            }} />
            Agent
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6vh' }}>
            {AGENT_SORTED.map((rule, i) => (
              <motion.span
                key={`agent-${rule.id}`}
                initial={{ opacity: 0, y: -40, x: (i % 2 === 0 ? -20 : 20), scale: 0.5 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                transition={{
                  delay: 1.6 + i * 0.15,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 120,
                  damping: 14,
                }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '1.3vh',
                  fontWeight: 700,
                  padding: '0.3vh 0.8vh',
                  borderRadius: 100,
                  background: `${rule.color}18`,
                  border: `1px solid ${rule.color}45`,
                  color: rule.color,
                  letterSpacing: '0.04em',
                }}
              >
                {rule.id}
                {rule.target === 'both' && (
                  <span style={{ marginLeft: '0.3vh', fontSize: '1.1vh', opacity: 0.6 }}>&#x2194;</span>
                )}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 3.2 }}
            style={{
              fontFamily: FONT_CHAT,
              fontSize: '1.2vh',
              color: 'rgba(255,255,255,0.5)',
              marginTop: 'auto',
            }}
          >
            Tone &middot; Formatting &middot; Fallback
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

const SCHEMA_LINE_START = 7000;
const SCHEMA_LINE_DUR = 2000;
const SPEC_LINE_START = 9200;
const SPEC_LINE_DUR = 2000;

function DefinitionPanel({ elapsed }: { elapsed: number }) {
  const schemaActive = elapsed >= SCHEMA_LINE_START && elapsed < SCHEMA_LINE_START + SCHEMA_LINE_DUR;
  const specActive = elapsed >= SPEC_LINE_START && elapsed < SPEC_LINE_START + SPEC_LINE_DUR;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100%',
      gap: '5vh',
      padding: '4vh',
    }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}
      >
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          fontWeight: 600,
          color: '#C4A0FF',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Definition
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: '52px',
          color: '#ffffff',
          lineHeight: 1.1,
        }}>
          Schema
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: '28px',
          color: 'rgba(255,255,255,0.6)',
        }}>
          what's possible
        </div>
        <motion.div
          animate={schemaActive ? {
            width: 120,
            opacity: 1,
            boxShadow: '0 0 14px rgba(134,41,255,0.6), 0 0 28px rgba(56,189,248,0.35)',
          } : {
            width: 60,
            opacity: 0.5,
            boxShadow: '0 0 0px rgba(134,41,255,0)',
          }}
          transition={{ duration: schemaActive ? 0.5 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 3,
            borderRadius: 2,
            background: schemaActive
              ? 'linear-gradient(90deg, #8629FF, #38BDF8, #8629FF)'
              : 'linear-gradient(90deg, #8629FF, #38BDF8)',
            backgroundSize: schemaActive ? '200% 100%' : '100% 100%',
            animation: schemaActive ? 'schemaLineShimmer 0.8s ease-in-out' : 'none',
            marginTop: '0.5vh',
          }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}
      >
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: '52px',
          color: '#ffffff',
          lineHeight: 1.1,
        }}>
          Specification
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: '28px',
          color: 'rgba(255,255,255,0.6)',
        }}>
          how to choose
        </div>
        <motion.div
          animate={specActive ? {
            width: 120,
            opacity: 1,
            boxShadow: '0 0 14px rgba(56,189,248,0.6), 0 0 28px rgba(134,41,255,0.35)',
          } : {
            width: 60,
            opacity: 0.5,
            boxShadow: '0 0 0px rgba(56,189,248,0)',
          }}
          transition={{ duration: specActive ? 0.5 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 3,
            borderRadius: 2,
            background: specActive
              ? 'linear-gradient(90deg, #38BDF8, #8629FF, #38BDF8)'
              : 'linear-gradient(90deg, #38BDF8, #8629FF)',
            backgroundSize: specActive ? '200% 100%' : '100% 100%',
            animation: specActive ? 'schemaLineShimmer 0.8s ease-in-out' : 'none',
            marginTop: '0.5vh',
          }} />
      </motion.div>
    </div>
  );
}

function ChatUI({ typedText }: { typedText: string }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(109,170,242,0.04) 0%, rgba(95,36,159,0.04) 75%), #fff',
        border: '1px solid rgba(48,37,141,0.12)',
        borderRadius: 16,
        overflow: 'hidden',
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 24px rgba(48,37,141,0.08)',
      }}
    >
      <div
        style={{
          padding: '1.2vh 1.6vh',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8vh',
          flexShrink: 0,
        }}
      >
        <BryteLogo size={28} id="s2_hdr" />
        <div>
          <div style={{ fontFamily: FONT_CHAT, fontWeight: 600, fontSize: '1.8vh', color: 'rgba(0,0,0,0.87)' }}>Bryte</div>
          <div style={{ fontFamily: FONT_CHAT, fontWeight: 400, fontSize: '1.2vh', color: 'rgba(0,0,0,0.55)', marginTop: 1 }}>UKG Ready AI Assistant</div>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            fontFamily: FONT_CHAT,
            fontSize: '1.2vh',
            fontWeight: 400,
            color: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 100,
            padding: '0.3vh 1vh',
          }}
        >
          Clear
        </div>
      </div>

      <div style={{ padding: '2.5vh 2vh', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8vh', marginBottom: '1.5vh' }}>
          <div style={{ marginTop: 2 }}><BryteLogo size={24} id="s2_av1" /></div>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 14,
              borderTopLeftRadius: 3,
              padding: '1.2vh 1.6vh',
              maxWidth: '75%',
            }}
          >
            <span style={{ fontFamily: FONT_CHAT, fontSize: '2vh', color: 'rgba(0,0,0,0.87)', lineHeight: 1.55 }}>
              Hi! I'm Bryte. How can I help you today?
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '0.8vh' }}>
          <div
            style={{
              background: 'rgba(0,0,0,0.05)',
              borderRadius: 14,
              borderTopRightRadius: 3,
              padding: '1.2vh 1.6vh',
              maxWidth: '85%',
              minHeight: '3vh',
            }}
          >
            <span style={{ fontFamily: FONT_CHAT, fontSize: '2vh', lineHeight: 1.5, color: 'rgba(0,0,0,0.87)' }}>
              {typedText || "\u00A0"}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                style={{
                  display: 'inline-block',
                  width: '1.2vh',
                  height: '2.2vh',
                  background: 'rgba(48,37,141,0.6)',
                  marginLeft: '0.3vh',
                  verticalAlign: 'middle',
                  borderRadius: '1px',
                }}
              />
            </span>
          </div>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(48,37,141,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <span style={{ fontFamily: FONT_CHAT, fontSize: '0.9vh', fontWeight: 700, color: '#222' }}>ME</span>
          </div>
        </div>
      </div>

      <div style={{
        padding: '0.8vh 1vh',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6vh',
        flexShrink: 0,
      }}>
        <div
          style={{
            flex: 1,
            padding: '0.9vh 1.4vh',
            borderRadius: 100,
            fontSize: '1.4vh',
            fontFamily: FONT_CHAT,
            color: 'rgba(0,0,0,0.5)',
            border: '1.5px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(239,149,14,0.4) 15%, rgba(238,39,114,0.4) 50%, rgba(79,65,187,0.4) 85%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          Ask Bryte...
        </div>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6DAAF2 0%, #5F249F 75%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Scene2({ isPlaying = true }: { isPlaying?: boolean }) {
  const elapsed = useSceneElapsed(isPlaying);
  const showChat = elapsed >= TRANSITION_TO_CHAT;
  const typedText = usePausableTypewriter(isPlaying, fullText, 55, TYPING_START_DELAY);

  const showDefinition = elapsed < DEFINITION_END;
  const currentPanel = showChat ? 'chat' : showDefinition ? 'definition' : 'spec-reveal';

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      style={{ padding: '6vh 5% 6vh 5%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ flex: '0 0 38%', paddingRight: '4%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-display font-bold text-white" style={{ fontSize: '5.5vh', lineHeight: 1.1 }}>
            What is a
          </h1>
          <h1 className="font-display font-bold" style={{ fontSize: '6vh', lineHeight: 1.1, color: '#8629FF' }}>
            Behavior Spec?
          </h1>
        </motion.div>
      </div>

      <motion.div
        style={{ flex: 1, position: 'relative' }}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {currentPanel === 'definition' && (
            <motion.div
              key="definition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '2.5vh 2.5vh',
                height: '70vh',
                overflow: 'hidden',
              }}
            >
              <DefinitionPanel elapsed={elapsed} />
            </motion.div>
          )}

          {currentPanel === 'spec-reveal' && (
            <motion.div
              key="spec-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '2.5vh 2.5vh',
                height: '70vh',
                overflow: 'hidden',
              }}
            >
              <SpecDocument elapsed={elapsed} />
            </motion.div>
          )}

          {currentPanel === 'chat' && (
            <motion.div
              key="chat-ui"
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ChatUI typedText={typedText} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
