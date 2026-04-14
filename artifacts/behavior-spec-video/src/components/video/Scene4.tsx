import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, type ReactNode } from 'react';
import { usePausableTimers, usePausableTypewriter } from '@/lib/video';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const BRYTE_LOGO_PATH_OUTER = "M27.6928 6.86067C27.4119 7.75951 27.1785 9.53921 27.8269 11.1042L27.8269 11.1041C28.4622 12.6376 29.8419 13.7183 30.6821 14.1724C30.7254 14.1868 30.7685 14.2029 30.8114 14.2207C31.5741 14.5365 32.0257 15.2861 31.9989 16.0651C31.9743 16.7964 31.5315 17.4812 30.8113 17.7795C30.7685 17.7972 30.7253 17.8133 30.682 17.8278C29.8418 18.2818 28.4621 19.3625 27.8268 20.896L27.8268 20.896C27.1785 22.4609 27.4118 24.2405 27.6927 25.1393C27.9099 25.6098 27.9375 26.1661 27.7235 26.6826C27.6434 26.876 27.5354 27.0493 27.4061 27.2C27.2155 27.4225 26.9709 27.6047 26.6816 27.7246C26.164 27.9389 25.6064 27.9108 25.1352 27.6924C24.2353 27.412 22.4576 27.1799 20.8941 27.8273L20.8941 27.8273C19.3669 28.4599 18.2886 29.8305 17.8312 30.6715C17.6628 31.1873 17.2784 31.6292 16.7377 31.8531C16.4902 31.9556 16.2336 32.0026 15.9816 32C15.7415 31.9979 15.4977 31.9506 15.2623 31.853C14.7217 31.6292 14.3373 31.1874 14.1689 30.6717C13.7115 29.8307 12.6332 28.4599 11.1059 27.8274L11.1059 27.8273C9.54256 27.1799 7.76499 27.412 6.86503 27.6923C6.3938 27.9108 5.83611 27.939 5.3184 27.7246C5.02629 27.6036 4.77981 27.4191 4.58837 27.1936C4.46152 27.0444 4.35545 26.8732 4.27649 26.6826C4.0625 26.1661 4.09015 25.6098 4.3074 25.1392C4.58821 24.2403 4.82146 22.4608 4.1732 20.896L4.17319 20.8961C3.53792 19.3626 2.1582 18.2819 1.31802 17.8278C1.27468 17.8134 1.23155 17.7973 1.18869 17.7795C0.468362 17.4812 0.0254892 16.7961 0.00111517 16.0646C-0.0255076 15.2857 0.426109 14.5365 1.18864 14.2207C1.23149 14.2029 1.27463 14.1868 1.31796 14.1724C2.15814 13.7183 3.53786 12.6376 4.17314 11.1041L4.17315 11.1042C4.82141 9.53938 4.58816 7.75988 4.30734 6.86095C4.09009 6.39043 4.06244 5.8341 4.27644 5.31756C4.35591 5.12572 4.46284 4.95356 4.59078 4.80375C4.78187 4.57957 5.02749 4.39604 5.31834 4.27559C5.83606 4.06118 6.39374 4.08939 6.86497 4.30787C7.76493 4.58823 9.54251 4.82026 11.1058 4.17286L11.1058 4.17282C12.6334 3.54018 13.7118 2.16918 14.169 1.32821C14.3375 0.812581 14.7218 0.370905 15.2624 0.14697C15.4985 0.048927 15.7421 0.00141996 15.9816 0.000110626C16.2336 -0.00261784 16.4902 0.0444412 16.7377 0.146966C17.2783 0.370896 17.6627 0.812497 17.8312 1.32824C18.2886 2.16939 19.367 3.54025 20.8942 4.17283L20.894 4.17287C22.4574 4.82028 24.2351 4.58824 25.135 4.30788C25.6062 4.08939 26.1639 4.06118 26.6817 4.2756C26.9709 4.39606 27.2155 4.57961 27.4061 4.80379C27.5355 4.95361 27.6434 5.12574 27.7235 5.31757C27.9375 5.83411 27.9098 6.39044 27.6928 6.86067Z";
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
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'rgba(48,37,141,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}
    >
      <span style={{ fontFamily: FONT_CHAT, fontSize: '1.2vh', fontWeight: 700, color: '#222' }}>ME</span>
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
      <BryteLogo size={32} id={`hdr_${panelId}`} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_CHAT, fontWeight: 600, fontSize: '2vh', color: 'rgba(0,0,0,0.87)' }}>Bryte</div>
        <div style={{ fontFamily: FONT_CHAT, fontWeight: 400, fontSize: '1.3vh', color: 'rgba(0,0,0,0.55)', marginTop: 1 }}>UKG Ready AI Assistant</div>
      </div>
      <div
        style={{
          fontFamily: FONT_CHAT,
          fontSize: '1.3vh',
          fontWeight: 400,
          color: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 100,
          padding: '0.4vh 1vh',
        }}
      >
        Clear
      </div>
    </div>
  );
}

function ChatInput({ typedText }: { typedText?: string }) {
  const hasText = typedText !== undefined && typedText.length > 0;
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
          fontSize: '1.6vh',
          fontFamily: FONT_CHAT,
          color: hasText ? 'rgba(0,0,0,0.87)' : 'rgba(0,0,0,0.5)',
          border: '1.5px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(239,149,14,0.4) 15%, rgba(238,39,114,0.4) 50%, rgba(79,65,187,0.4) 85%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          position: 'relative' as const,
        }}
      >
        {hasText ? (
          <span>
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              style={{ display: 'inline-block', width: '1px', height: '1.3vh', background: '#30258D', marginLeft: 1, verticalAlign: 'middle' }}
            />
          </span>
        ) : 'Ask Bryte...'}
      </div>
      <div
        style={{
          width: 34,
          height: 34,
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

const TYPEAHEAD_TEXT = "why is my pay short";
const CHAR_DELAY = 80;

function TypeAheadText({ isPlaying = true }: { isPlaying?: boolean }) {
  const typedText = usePausableTypewriter(isPlaying, TYPEAHEAD_TEXT, CHAR_DELAY, 2000);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '8vh',
      }}
    >
      <motion.h2
        style={{
          fontFamily: FONT_CHAT,
          fontWeight: 800,
          fontSize: '5vh',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.2,
          textAlign: 'center',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Three times the same question
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.2vh',
          flexDirection: 'row-reverse' as const,
        }}
      >
        <div style={{ marginTop: '0.4vh' }}>
          <UserAvatar />
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
    </motion.div>
  );
}

function MiniTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: FONT_CHAT,
        fontSize: '1.5vh',
        marginTop: '0.5vh',
      }}
    >
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                textAlign: 'left',
                padding: '0.5vh 0.8vh',
                borderBottom: '1.5px solid rgba(0,0,0,0.15)',
                fontWeight: 700,
                color: 'rgba(0,0,0,0.75)',
                fontSize: '1.3vh',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                style={{
                  padding: '0.5vh 0.8vh',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  color: 'rgba(0,0,0,0.7)',
                  fontWeight: ci === 0 ? 600 : 400,
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface ResponseCardProps {
  panelId: string;
  attemptNum: number;
  children: ReactNode;
}

function ResponseCard({ panelId, attemptNum, children }: ResponseCardProps) {
  return (
    <div
      style={{
        width: '52vw',
        background: 'linear-gradient(135deg, rgba(109,170,242,0.04) 0%, rgba(95,36,159,0.04) 75%), #fff',
        borderRadius: 14,
        border: '1px solid rgba(48,37,141,0.12)',
        boxShadow: '0 4px 24px rgba(48,37,141,0.08)',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <ChatHeader panelId={panelId} />
      <div style={{ padding: '1.4vh 1.4vh 1.4vh', display: 'flex', flexDirection: 'column', gap: 0, flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6vh',
            marginBottom: '1.2vh',
            flexDirection: 'row-reverse',
          }}
        >
          <UserAvatar />
          <div
            style={{
              padding: '1vh 1.4vh',
              borderRadius: '12px',
              borderTopRightRadius: '3px',
              background: 'rgba(0,0,0,0.05)',
              fontFamily: FONT_CHAT,
              fontSize: '2vh',
              lineHeight: 1.55,
              color: 'rgba(0,0,0,0.87)',
            }}
          >
            why is my pay short
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6vh' }}>
          <div style={{ marginTop: 2, flexShrink: 0 }}><BryteLogo size={30} id={`av_${panelId}_${attemptNum}`} /></div>
          <div
            style={{
              flex: 1,
              padding: '1vh 1.4vh',
              borderRadius: '12px',
              borderTopLeftRadius: '3px',
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              fontFamily: FONT_CHAT,
              fontSize: '2vh',
              lineHeight: 1.55,
              color: 'rgba(0,0,0,0.87)',
            }}
          >
            {children}
          </div>
        </div>
      </div>
      <ChatInput />
    </div>
  );
}

function Response1() {
  return (
    <ResponseCard panelId="r1" attemptNum={1}>
      <div style={{ marginBottom: '0.4vh' }}>
        As Bryte AI, I can help you look into your pay. I've retrieved the details for your last two pay statements.
      </div>
      <div style={{ marginBottom: '0.4vh' }}>
        It looks like your most recent net pay was actually higher than your previous one, primarily due to overtime earnings.
      </div>
      <div style={{ marginBottom: '0.4vh' }}>Here is a comparison of your last two pay statements:</div>
      <MiniTable
        headers={['Category', 'Pay Date: 3/07/2026', 'Pay Date: 3/21/2026']}
        rows={[
          ['Gross Pay', '$2,500.00', '$2,734.40'],
          ['Total Deductions', '$175.00', '$175.00'],
        ]}
      />
    </ResponseCard>
  );
}

function Response2() {
  return (
    <ResponseCard panelId="r2" attemptNum={2}>
      <div style={{ marginBottom: '0.4vh' }}>
        I can help you review your most recent pay statement to understand the details.
      </div>
      <div style={{ marginBottom: '0.3vh' }}>
        Here is a breakdown of your pay for the period of March 2–15, 2026, with a pay date of Friday, 3/21/2026:
      </div>
      <div style={{ fontWeight: 700, fontSize: '1.4vh', marginTop: '0.3vh', marginBottom: '0.1vh' }}>Earnings</div>
      <MiniTable
        headers={['Earning Type', 'Hours', 'Rate', 'Amount']}
        rows={[
          ['Regular Pay', '80', 'N/A', '$2,500.00'],
          ['Overtime', '5', 'N/A', '$234.40'],
        ]}
      />
      <div style={{ fontWeight: 700, fontSize: '1.4vh', marginTop: '0.4vh', marginBottom: '0.1vh' }}>Deductions</div>
      <MiniTable
        headers={['Deduction Type', 'Amount']}
        rows={[
          ['401(k)', '-$100.00'],
        ]}
      />
    </ResponseCard>
  );
}

function Response3() {
  return (
    <ResponseCard panelId="r3" attemptNum={3}>
      <div style={{ marginBottom: '0.4vh' }}>
        It looks like your most recent paycheck for the pay period of March 2–15, 2026, which was paid on Friday, 3/21/2026, is actually higher than your previous paycheck.
      </div>
      <div style={{ marginBottom: '0.4vh' }}>
        This is primarily due to 5 hours of overtime pay you received in the current pay period, which was not present in the previous one.
      </div>
      <div>
        Would you like me to show you the full details of your most recent paycheck, or would you like to compare it side-by-side with your previous paycheck?
      </div>
    </ResponseCard>
  );
}

function AnnotationLine({ label, delay, show }: { label: string; delay: number; show: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3, delay: show ? delay : 0 }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '100%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <motion.div
        initial={false}
        animate={{ scaleX: show ? 1 : 0 }}
        transition={{ duration: 0.5, delay: show ? delay + 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '10vw',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(109,170,242,0.4), rgba(109,170,242,0.9))',
          transformOrigin: 'left center',
          flexShrink: 0,
        }}
      />
      <motion.div
        initial={false}
        animate={{ scale: show ? 1 : 0 }}
        transition={{ delay: show ? delay + 0.4 : 0, type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          width: '1vh',
          height: '1vh',
          borderRadius: '50%',
          background: '#6DAAF2',
          flexShrink: 0,
          boxShadow: '0 0 8px rgba(109,170,242,0.5)',
        }}
      />
      <motion.span
        initial={false}
        animate={{ opacity: show ? 1 : 0, x: show ? 0 : 10 }}
        transition={{ duration: 0.4, delay: show ? delay + 0.55 : 0 }}
        style={{
          fontFamily: FONT_CHAT,
          fontSize: '1.8vh',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.9)',
          whiteSpace: 'nowrap',
          marginLeft: '1vw',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '0.8vh',
          padding: '0.6vh 1.4vh',
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

type Phase =
  | 'typing'
  | 'headline'
  | 'attempt1'
  | 'attempt2'
  | 'attempt3'
  | 'transition'
  | 'payoff';

export function Scene4({ isPlaying = true }: { isPlaying?: boolean }) {
  const [phase, setPhase] = useState<Phase>('typing');

  const timerEvents = useMemo(() => [
    { time: 7500, callback: () => setPhase('headline') },
    { time: 8000, callback: () => setPhase('attempt1') },
    { time: 10000, callback: () => setPhase('attempt2') },
    { time: 14000, callback: () => setPhase('attempt3') },
    { time: 25000, callback: () => setPhase('transition') },
    { time: 31000, callback: () => setPhase('payoff') },
  ], []);

  usePausableTimers(isPlaying, timerEvents);

  const showTyping = phase === 'typing';
  const showTransition = phase === 'transition';
  const showPayoff = phase === 'payoff';
  const isPart2 = showTransition || showPayoff;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ fontFamily: FONT_CHAT, overflow: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <AnimatePresence mode="wait">
        {showTyping ? (
          <motion.div
            key="typing"
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <TypeAheadText isPlaying={isPlaying} />
          </motion.div>
        ) : !isPart2 ? (
          <motion.div
            key="part1"
            className="absolute inset-0 flex flex-col"
            style={{ padding: '6vh 3% 3vh 3%' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 0,
              position: 'relative',
            }}>
              <motion.div
                className="text-center"
                style={{ position: 'absolute', top: '80px', left: 0, right: 0, zIndex: 10 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 style={{
                  fontFamily: FONT_CHAT,
                  fontWeight: 800,
                  fontSize: '4.5vh',
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.2,
                }}>
                  Three times the same question
                </h2>
              </motion.div>
              <AnimatePresence mode="wait">
                {(phase === 'headline' || phase === 'attempt1') && (
                  <motion.div
                    key="single-1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -80, rotateY: -15 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5vh', transform: 'scale(1.15)', transformOrigin: 'center center' }}
                  >
                    <motion.div
                      style={{
                        fontFamily: FONT_CHAT,
                        fontSize: '2vh',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Attempt 1 — Comparison
                    </motion.div>
                    <Response1 />
                  </motion.div>
                )}

                {phase === 'attempt2' && (
                  <motion.div
                    key="single-2"
                    initial={{ opacity: 0, x: 80, rotateY: 15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -80, rotateY: -15 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5vh', transform: 'scale(1.15)', transformOrigin: 'center center' }}
                  >
                    <div style={{
                      fontFamily: FONT_CHAT,
                      fontSize: '2vh',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.7)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                    }}>
                      Attempt 2 — Pay Statement Breakdown
                    </div>
                    <Response2 />
                  </motion.div>
                )}

                {phase === 'attempt3' && (
                  <motion.div
                    key="single-3"
                    initial={{ opacity: 0, x: 80, rotateY: 15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5vh', transform: 'scale(1.15)', transformOrigin: 'center center' }}
                  >
                    <div style={{
                      fontFamily: FONT_CHAT,
                      fontSize: '2vh',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.7)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                    }}>
                      Attempt 3 — Explanation Only
                    </div>
                    <Response3 />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {(phase === 'attempt1' || phase === 'attempt2' || phase === 'attempt3') && (
              <motion.div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.8vh',
                  paddingBottom: '1vh',
                  flexShrink: 0,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[1, 2, 3].map((n) => {
                  const currentAttempt = phase === 'attempt1' ? 1 : phase === 'attempt2' ? 2 : 3;
                  return (
                    <div
                      key={n}
                      style={{
                        width: '0.8vh',
                        height: '0.8vh',
                        borderRadius: '50%',
                        background: n === currentAttempt ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                        transition: 'background 0.3s',
                      }}
                    />
                  );
                })}
              </motion.div>
            )}

          </motion.div>
        ) : (
          <motion.div
            key="part2"
            className="absolute inset-0 flex flex-col"
            style={{ padding: '3vh 4% 3vh 4%' }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, overflow: 'visible', position: 'relative' }}>
              <motion.div
                style={{ textAlign: 'center', position: 'absolute', top: '120px', left: 0, right: 0, zIndex: 10 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  style={{
                    fontFamily: FONT_CHAT,
                    fontWeight: 800,
                    fontSize: '4.5vh',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: 1.25,
                  }}>
                  Repeatable by <span style={{ color: '#C084FC' }}>design</span>
                </h2>
              </motion.div>
              <motion.div
                style={{ width: '46%', maxWidth: '70vh', flexShrink: 0 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(109,170,242,0.04) 0%, rgba(95,36,159,0.04) 75%), #fff',
                    borderRadius: 14,
                    border: '1px solid rgba(48,37,141,0.18)',
                    boxShadow: '0 4px 32px rgba(48,37,141,0.14)',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    overflow: 'visible',
                  }}
                >
                  <div style={{ borderRadius: '14px 14px 0 0', overflow: 'hidden' }}>
                    <ChatHeader panelId="payoff" />
                  </div>
                  <div style={{ padding: '1.4vh 1.4vh', display: 'flex', flexDirection: 'column', gap: 0, overflow: 'visible' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6vh', marginBottom: '1.2vh' }}>
                      <div style={{ marginTop: 2, flexShrink: 0 }}><BryteLogo size={28} id="av_payoff_ai1" /></div>
                      <div style={{
                        padding: '0.8vh 1.2vh',
                        borderRadius: 12,
                        borderTopLeftRadius: 3,
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.08)',
                        fontFamily: FONT_CHAT,
                        fontSize: '1.7vh',
                        lineHeight: 1.55,
                        color: 'rgba(0,0,0,0.87)',
                      }}>
                        Hi! I'm Bryte. How can I help you today?
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6vh', marginBottom: '1.2vh', flexDirection: 'row-reverse' }}>
                      <UserAvatar />
                      <div style={{
                        padding: '0.8vh 1.2vh',
                        borderRadius: 12,
                        borderTopRightRadius: 3,
                        background: 'rgba(0,0,0,0.05)',
                        fontFamily: FONT_CHAT,
                        fontSize: '1.7vh',
                        lineHeight: 1.55,
                        color: 'rgba(0,0,0,0.87)',
                      }}>
                        why is my pay short
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6vh', overflow: 'visible' }}>
                      <div style={{ marginTop: 2, flexShrink: 0 }}><BryteLogo size={28} id="av_payoff_ai2" /></div>
                      <div
                        style={{
                          flex: 1,
                          padding: '1vh 1.2vh',
                          borderRadius: 12,
                          borderTopLeftRadius: 3,
                          background: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.08)',
                          fontFamily: FONT_CHAT,
                          fontSize: '1.6vh',
                          lineHeight: 1.55,
                          color: 'rgba(0,0,0,0.87)',
                          overflow: 'visible',
                          position: 'relative' as const,
                        }}
                      >
                        <div style={{ marginBottom: '0.5vh', position: 'relative' as const, overflow: 'visible' }}>
                          <span
                            style={{
                              textDecoration: 'underline',
                              textDecorationColor: '#8629FF',
                              textUnderlineOffset: '3px',
                              textDecorationThickness: '2px',
                              fontWeight: 600,
                            }}
                          >
                            I understand this is concerning.
                          </span>
                          {' '}Let's compare your two most recent pay statements to see the details.
                          <AnnotationLine label="Acknowledgment of concern" delay={0} show={showPayoff} />
                        </div>
                        <div style={{ marginBottom: '0.5vh' }}>
                          <span style={{ color: '#8629FF', fontWeight: 600 }}>
                            Here's a comparison
                          </span>
                          {' '}of your paycheck from <strong>Friday, 3/21/2026</strong> with your previous paycheck from <strong>Friday, 3/07/2026</strong>:
                        </div>
                        <div style={{ position: 'relative' as const, overflow: 'visible' }}>
                          <MiniTable
                            headers={['Category', 'Paycheck\n(3/07/2026)', 'Paycheck\n(3/21/2026)']}
                            rows={[
                              ['Gross Pay', '$2,500.00', '$2,734.40'],
                              ['Total Deductions', '$175.00', '$175.00'],
                            ]}
                          />
                          <AnnotationLine label="Structured data presentation" delay={2.0} show={showPayoff} />
                        </div>
                        <div style={{ marginTop: '0.6vh', position: 'relative' as const, overflow: 'visible' }}>
                          <span style={{ color: '#8629FF', fontWeight: 500 }}>
                            Would you like me to break down each deduction?
                          </span>
                          <AnnotationLine label="Clear next step" delay={3.5} show={showPayoff} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '1.5vh',
          right: '2vw',
          fontFamily: FONT_CHAT,
          fontSize: '1.4vh',
          color: 'rgba(255,255,255,0.75)',
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
