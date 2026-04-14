import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { usePausableTimers } from '@/lib/video';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const BRYTE_LOGO_PATH_OUTER = "M27.6928 6.86067C27.4119 7.75951 27.1785 9.53921 27.8269 11.1042L27.8269 11.1041C28.4622 12.6376 29.8419 13.7183 30.6821 14.1724C30.7254 14.1868 30.7685 14.2029 30.8114 14.2207C31.5741 14.5365 32.0257 15.2861 31.9989 16.0651C31.9743 16.7964 31.5315 17.4812 30.8113 17.7795C30.7685 17.7972 30.7253 17.8133 30.682 17.8278C29.8418 18.2818 28.4621 19.3625 27.8268 20.896L27.8268 20.896C27.1785 22.4609 27.4118 24.2405 27.6927 25.1393C27.9099 25.6098 27.9375 26.1661 27.7235 26.6826C27.6434 26.876 27.5354 27.0493 27.4061 27.2C27.2155 27.4225 26.9709 27.6047 26.6816 27.7246C26.164 27.9389 25.6064 27.9108 25.1352 27.6924C24.2353 27.412 22.4576 27.1799 20.8941 27.8273L20.8941 27.8273C19.3669 28.4599 18.2886 29.8305 17.8312 30.6715C17.6628 31.1873 17.2784 31.6292 16.7377 31.8531C16.4902 31.9556 16.2336 32.0026 15.9816 32C15.7415 31.9979 15.4977 31.9506 15.2623 31.853C14.7217 31.6292 14.3373 31.1874 14.1689 30.6717C13.7115 29.8307 12.6332 28.4599 11.1059 27.8274L11.1059 27.8273C9.54256 27.1799 7.76499 27.412 6.86503 27.6923C6.3938 27.9108 5.83611 27.939 5.3184 27.7246C5.02629 27.6036 4.77981 27.4191 4.58837 27.1936C4.46152 27.0444 4.35545 26.8732 4.27649 26.6826C4.0625 26.1661 4.09015 25.6098 4.3074 25.1392C4.58821 24.2403 4.82146 22.4608 4.1732 20.896L4.17319 20.8961C3.53792 19.3626 2.1582 18.2819 1.31802 17.8278C1.27468 17.8134 1.23155 17.7973 1.18869 17.7795C0.468362 17.4812 0.0254892 16.7961 0.00111517 16.0646C-0.0255076 15.2857 0.426109 14.5365 1.18864 14.2207C1.23149 14.2029 1.27463 14.1868 1.31796 14.1724C2.15814 13.7183 3.53786 12.6376 4.17314 11.1041L4.17315 11.1042C4.82141 9.53938 4.58816 7.75988 4.30734 6.86095C4.09009 6.39043 4.06244 5.8341 4.27644 5.31756C4.35591 5.12572 4.46284 4.95356 4.59078 4.80375C4.78187 4.57957 5.02749 4.39604 5.31834 4.27559C5.83606 4.06118 6.39374 4.08939 6.86497 4.30787C7.76493 4.58823 9.54251 4.82026 11.1058 4.17286L11.1058 4.17282C12.6334 3.54018 13.7118 2.16918 14.169 1.32821C14.3375 0.812581 14.7218 0.370903 15.2623 0.147044C15.5152 0.0423256 15.7776 -0.00451819 16.0347 0.000412566C16.2696 0.00444317 16.5076 0.0518107 16.7377 0.147113C17.2781 0.370922 17.6623 0.812449 17.8308 1.32793C18.2881 2.16888 19.3665 3.54006 20.8942 4.17275L20.8942 4.17279C22.4578 4.82029 24.2357 4.58809 25.1355 4.30767C25.6066 4.08937 26.1641 4.06123 26.6817 4.27558C26.9622 4.39175 27.2006 4.56657 27.3886 4.77995C27.5257 4.93522 27.6399 5.11544 27.7236 5.31749C27.9375 5.83395 27.9099 6.39019 27.6928 6.86067ZM16 5.27616C16.8655 6.21263 18.0072 7.12504 19.4273 7.71319L19.4273 7.71323C20.8518 8.30321 22.3092 8.46444 23.5863 8.41264C23.5345 9.6895 23.6958 11.1465 24.2858 12.5707L24.2858 12.5707C24.8746 13.9919 25.7884 15.1344 26.726 16C25.7884 16.8657 24.8746 18.0082 24.2858 19.4295L24.2858 19.4295C23.6957 20.8537 23.5345 22.3106 23.5862 23.5875C22.3091 23.5357 20.8518 23.6969 19.4272 24.2869L19.4273 24.2869C18.0072 24.875 16.8654 25.7875 16 26.7239C15.1345 25.7875 13.9928 24.8751 12.5727 24.2869L12.5728 24.2869C11.1482 23.6969 9.69091 23.5357 8.41378 23.5875C8.46554 22.3106 8.30426 20.8537 7.71425 19.4295L7.71424 19.4295C7.12542 18.0082 6.21159 16.8657 5.27397 16.0001C6.21157 15.1344 7.12538 13.992 7.71419 12.5707L7.7142 12.5707C8.30421 11.1465 8.46549 9.68956 8.41373 8.41271C9.69086 8.46451 11.1482 8.30328 12.5727 7.7133L12.5727 7.71326C13.9928 7.1251 15.1346 6.21265 16 5.27616Z";
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

function UserAvatar() {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: 'rgba(48,37,141,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}
    >
      <span style={{ fontFamily: FONT_CHAT, fontSize: '0.8vh', fontWeight: 700, color: '#222' }}>ME</span>
    </div>
  );
}

function ChatHeader({ panelId }: { panelId: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8vh',
        padding: '1.2vh 1.4vh',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        flexShrink: 0,
      }}
    >
      <BryteLogo size={24} id={`hdr_${panelId}`} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_CHAT, fontWeight: 600, fontSize: '1.5vh', color: 'rgba(0,0,0,0.87)' }}>Bryte</div>
        <div style={{ fontFamily: FONT_CHAT, fontWeight: 400, fontSize: '1vh', color: 'rgba(0,0,0,0.55)', marginTop: 1 }}>UKG Ready AI Assistant</div>
      </div>
      <div
        style={{
          fontFamily: FONT_CHAT,
          fontSize: '1vh',
          fontWeight: 400,
          color: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 100,
          padding: '0.3vh 0.8vh',
          cursor: 'default',
        }}
      >
        Clear
      </div>
    </div>
  );
}

interface ChatBubbleProps {
  text: string;
  isUser?: boolean;
  showAvatar?: boolean;
  highlighted?: boolean;
}

function ChatBubble({ text, isUser = false, showAvatar = false, highlighted = false }: ChatBubbleProps) {
  const canHighlight = !isUser;

  return (
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.6vh',
        marginBottom: '1.2vh',
        flexDirection: isUser ? 'row-reverse' : 'row',
        position: 'relative',
        zIndex: highlighted && canHighlight ? 10 : 'auto',
        transformOrigin: 'center center',
      }}
      animate={highlighted && canHighlight
        ? { scale: 1.25, y: -10 }
        : { scale: 1, y: 0 }
      }
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {isUser ? (
        <UserAvatar />
      ) : showAvatar ? (
        <div style={{ marginTop: 2, flexShrink: 0 }}><BryteLogo size={22} id={`av_${Math.random().toString(36).slice(2, 6)}`} /></div>
      ) : (
        <div style={{ width: 22, flexShrink: 0 }} />
      )}
      <motion.div
        style={{
          maxWidth: highlighted && canHighlight ? '92%' : '82%',
          padding: highlighted && canHighlight ? '1vh 1.3vh' : '0.8vh 1.1vh',
          borderRadius: '12px',
          ...(isUser
            ? {
                background: 'rgba(0,0,0,0.05)',
                borderTopRightRadius: '3px',
              }
            : {
                background: '#ffffff',
                borderTopLeftRadius: '3px',
              }),
          fontFamily: FONT_CHAT,
          fontSize: '1.3vh',
          lineHeight: 1.55,
          color: highlighted && canHighlight ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0.87)',
          fontWeight: 400,
          whiteSpace: 'pre-line' as const,
        }}
        animate={highlighted && canHighlight
          ? {
              boxShadow: '0 0 30px rgba(109,170,242,0.3), 0 8px 32px rgba(48,37,141,0.18)',
              border: '2px solid rgba(109,170,242,0.5)',
            }
          : {
              boxShadow: '0 0 0px rgba(109,170,242,0), 0 0 0px rgba(48,37,141,0)',
              border: isUser ? '1px solid transparent' : '1px solid rgba(0,0,0,0.08)',
            }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6vh', marginBottom: '1.2vh' }}>
      <div style={{ marginTop: 2, flexShrink: 0 }}><BryteLogo size={22} id="typing_av" /></div>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '12px',
          borderTopLeftRadius: '3px',
          padding: '1.1vh 1.4vh',
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

function SuggestionChips({ chips }: { chips: string[] }) {
  return (
    <div style={{
      padding: '0.5vh 1vh 0.8vh',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5vh',
      flexShrink: 0,
    }}>
      {chips.map((chip, i) => (
        <span
          key={i}
          style={{
            fontFamily: FONT_CHAT,
            fontSize: '1vh',
            fontWeight: 400,
            color: '#222',
            border: '1px solid rgba(48,37,141,0.22)',
            borderRadius: 100,
            padding: '0.35vh 0.9vh',
            background: 'white',
            whiteSpace: 'nowrap',
          }}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

function ChatInput() {
  return (
    <div style={{
      padding: '0.6vh 0.7vh',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6vh',
      flexShrink: 0,
    }}>
      <div
        style={{
          flex: 1,
          padding: '0.7vh 1.2vh',
          borderRadius: 100,
          fontSize: '1.2vh',
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
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6DAAF2 0%, #5F249F 75%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
          <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

interface ChatPanelProps {
  messages: ChatBubbleProps[];
  chips?: string[];
  showTyping?: boolean;
  isAfter?: boolean;
  panelId: string;
  highlightLastAI?: boolean;
}

function ChatPanel({ messages, chips, showTyping, isAfter, panelId, highlightLastAI = false }: ChatPanelProps) {
  const lastAIIndex = messages.reduce((acc, msg, i) => (!msg.isUser ? i : acc), -1);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(109,170,242,0.04) 0%, rgba(95,36,159,0.04) 75%), #fff',
        borderRadius: 16,
        border: isAfter ? '1px solid rgba(48,37,141,0.25)' : '1px solid rgba(48,37,141,0.12)',
        boxShadow: isAfter
          ? '0 4px 32px rgba(48,37,141,0.14)'
          : '0 4px 24px rgba(48,37,141,0.08)',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: highlightLastAI ? 'visible' : 'hidden',
      }}
    >
      <ChatHeader panelId={panelId} />
      <div style={{ padding: '1.4vh 1.4vh 1.4vh', display: 'flex', flexDirection: 'column', gap: 0, overflow: highlightLastAI ? 'visible' : 'hidden' }}>
        {messages.map((msg, i) => (
          <ChatBubble key={i} {...msg} highlighted={highlightLastAI && i === lastAIIndex} />
        ))}
        {showTyping && <TypingIndicator />}
      </div>
    </div>
  );
}

function AnalysisBar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 4.0 }}
      style={{ width: '100%', maxWidth: 'calc(30vw + 30vw + 4vw)' , margin: '0 auto' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          background: 'white',
          border: '1px solid rgba(48,37,141,0.18)',
          borderRadius: expanded ? '12px 12px 0 0' : 12,
          padding: '0.8vh 1.4vh',
          fontSize: '1.2vh',
          fontWeight: 600,
          fontFamily: FONT_CHAT,
          color: '#30258D',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        What the spec changed
        <span style={{ fontStyle: 'normal', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', fontSize: '1vh' }}>▾</span>
      </button>
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'white',
            border: '1px solid rgba(48,37,141,0.18)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            padding: '1.2vh 1.4vh',
            fontFamily: FONT_CHAT,
            fontSize: '1.15vh',
            lineHeight: 1.65,
            color: 'rgba(0,0,0,0.75)',
          }}
        >
          <div style={{ marginBottom: '1.2vh' }}>
            <div style={{ fontSize: '1vh', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(0,0,0,0.6)', marginBottom: '0.6vh' }}>
              HOW IT WAS ROUTED
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7vh', marginBottom: '0.6vh' }}>
              <div>
                <div style={{ fontSize: '1.15vh', fontWeight: 700, color: 'rgba(0,0,0,0.75)', marginBottom: '0.2vh' }}>Without spec</div>
                <div style={{ fontSize: '1.15vh', fontWeight: 600, color: 'rgba(0,0,0,0.75)' }}>Orchestrator → Time Off Request Agent</div>
              </div>
              <div>
                <div style={{ fontSize: '1.15vh', fontWeight: 700, color: 'rgba(0,0,0,0.75)', marginBottom: '0.2vh' }}>With spec</div>
                <div style={{ fontSize: '1.15vh', fontWeight: 600, color: '#222' }}>Orchestrator → direct</div>
              </div>
            </div>
            <div style={{ fontSize: '1.1vh', color: 'rgba(0,0,0,0.65)', lineHeight: 1.55 }}>
              The &quot;without spec&quot; routing was incorrect because it prematurely sent the request to the Time Off Request Agent, which then focused solely on collecting leave details. The &quot;with spec&quot; panel routed directly to the Orchestrator because the behavioral specification likely instructed it to identify and clarify ambiguous terms.
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', margin: '1vh 0' }} />

          <div style={{ marginBottom: '1.2vh' }}>
            <div style={{ fontSize: '1vh', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(0,0,0,0.6)', marginBottom: '0.5vh' }}>
              RULES WITH VISIBLE IMPACT
            </div>
            <div style={{ display: 'flex', gap: '0.4vh' }}>
              {['COMPOUND INTENT', 'FMT-09'].map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.9vh',
                    fontWeight: 600,
                    padding: '0.15vh 0.7vh',
                    borderRadius: 100,
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: 'rgba(0,0,0,0.06)',
                    color: 'rgba(0,0,0,0.7)',
                    letterSpacing: '0.03em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', margin: '1vh 0' }} />

          <div>
            <div style={{ fontSize: '1vh', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#30258D', marginBottom: '0.6vh' }}>
              WHAT THE SPEC CHANGED
            </div>
            <div style={{ marginBottom: '1vh' }}>
              <div style={{ fontWeight: 700, color: 'rgba(0,0,0,0.87)', marginBottom: '0.2vh' }}>Ambiguity Resolution</div>
              <div style={{ color: 'rgba(0,0,0,0.65)', lineHeight: 1.55 }}>
                <strong style={{ color: 'rgba(0,0,0,0.75)', fontWeight: 600 }}>Without spec:</strong> Assumes the meaning of &quot;coverage&quot; and provides a general statement without clarifying.
              </div>
              <div style={{ color: 'rgba(0,0,0,0.65)', lineHeight: 1.55 }}>
                <strong style={{ color: 'rgba(0,0,0,0.75)', fontWeight: 600 }}>With spec:</strong> Asks a focused clarifying question to resolve the ambiguity of &quot;coverage.&quot; (Rule: COMPOUND INTENT)
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'rgba(0,0,0,0.87)', marginBottom: '0.2vh' }}>Order of Intent Handling</div>
              <div style={{ color: 'rgba(0,0,0,0.65)', lineHeight: 1.55 }}>
                <strong style={{ color: 'rgba(0,0,0,0.75)', fontWeight: 600 }}>Without spec:</strong> Immediately proceeds to gather details for the leave request without first resolving the &quot;coverage&quot; ambiguity.
              </div>
              <div style={{ color: 'rgba(0,0,0,0.65)', lineHeight: 1.55 }}>
                <strong style={{ color: 'rgba(0,0,0,0.75)', fontWeight: 600 }}>With spec:</strong> Pauses the primary task (leave request) to first resolve the ambiguous term, as per priority rules. (Rule: COMPOUND INTENT)
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

const beforeMessages: ChatBubbleProps[] = [
  { text: "Hi! I'm Bryte. How can I help you today?", showAvatar: true },
  { text: "Help me request leave for next month without messing up coverage", isUser: true },
  {
    text: "I can help with that. To avoid messing up coverage, your manager will review and approve the request.\n\nWhat specific dates next month would you like to request off? And what type of leave would you like to use?\nYou have the following options:\n• Vacation (12.50 hrs available)\n• Sick Leave (8.00 hrs available)\n• PTO (5.25 hrs available)\n• Personal Day (1 day available)",
    showAvatar: true,
  },
];

const afterMessages: ChatBubbleProps[] = [
  { text: "Hi! I'm Bryte. How can I help you today?", showAvatar: true },
  { text: "Help me request leave for next month without messing up coverage", isUser: true },
  {
    text: 'When you say coverage — do you mean making sure your team\'s shifts are covered, or something related to your benefits coverage while you\'re on leave?',
    showAvatar: true,
  },
];

const suggestionChips = [
  'Leave + coverage concern',
  'Job loss concern',
  'Change tax withholding',
  'Visa question',
];

type Phase = 'intro' | 'focus-without' | 'pause' | 'focus-with' | 'both';

export function Scene3({ isPlaying = true }: { isPlaying?: boolean }) {
  const [phase, setPhase] = useState<Phase>('intro');

  const timerEvents = useMemo(() => [
    { time: 1500, callback: () => setPhase('focus-without') },
    { time: 9500, callback: () => setPhase('pause') },
    { time: 10500, callback: () => setPhase('focus-with') },
    { time: 17000, callback: () => setPhase('both') },
  ], []);

  usePausableTimers(isPlaying, timerEvents);

  const focusingWithout = phase === 'focus-without';
  const focusingWith = phase === 'focus-with';

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ padding: '4vh 3% 14vh 3%', fontFamily: FONT_CHAT, overflow: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="text-center"
        style={{ marginBottom: '2.5vh', flexShrink: 0 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 style={{ fontFamily: FONT_CHAT, fontWeight: 800, fontSize: '4.5vh', color: '#ffffff', margin: 0 }}>
          Same question. Different rules.
        </h2>
      </motion.div>

      <div style={{ display: 'flex', gap: '0', flex: 1, alignItems: 'stretch', minHeight: 0, justifyContent: 'center' }}>
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: '1vh', width: '42vw', transformOrigin: 'center center' }}
          animate={{
            opacity: focusingWith ? 0.08 : 1,
            scale: focusingWith ? 0.92 : focusingWithout ? 1.02 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            style={{
              fontFamily: FONT_CHAT,
              fontWeight: 700,
              fontSize: '2vh',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              padding: '0 4px',
            }}
          >
            Without behavioral spec
          </span>
          <div
            style={{ flex: 1, display: 'flex', minHeight: 0 }}
          >
            <ChatPanel
              panelId="before"
              messages={beforeMessages}
              chips={suggestionChips}
              highlightLastAI={focusingWithout}
            />
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: focusingWithout || focusingWith ? 0.08 : 0.25 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.7vh',
            color: 'rgba(255,255,255,0.25)',
            fontSize: '1.3vh',
            fontWeight: 600,
            fontFamily: FONT_CHAT,
            letterSpacing: '0.05em',
            width: '4vw',
            flexShrink: 0,
          }}
        >
          <div style={{ width: 1, height: '7vh', background: 'rgba(255,255,255,0.12)' }} />
          VS
          <div style={{ width: 1, height: '7vh', background: 'rgba(255,255,255,0.12)' }} />
        </motion.div>

        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: '1vh', width: '42vw', transformOrigin: 'center center' }}
          animate={{
            opacity: focusingWithout ? 0.08 : 1,
            scale: focusingWith ? 1.02 : focusingWithout ? 0.92 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            style={{
              fontFamily: FONT_CHAT,
              fontWeight: 700,
              fontSize: '2vh',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              padding: '0 4px',
            }}
          >
            With the behavioral spec
          </span>
          <div
            style={{ flex: 1, display: 'flex', minHeight: 0 }}
          >
            <ChatPanel
              panelId="after"
              messages={afterMessages}
              chips={suggestionChips}
              showTyping
              isAfter
              highlightLastAI={focusingWith}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '1.5vh',
          right: '2vw',
          fontFamily: FONT_CHAT,
          fontSize: '1vh',
          color: 'rgba(255,255,255,0.25)',
          fontStyle: 'italic',
          letterSpacing: '0.02em',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        AI-generated responses based on UKG Ready agent orchestration patterns
      </motion.div>
    </motion.div>
  );
}
