import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { usePausableTimers } from '@/lib/video';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

const ACCENT = '#60CDFF';
const ACCENT_PURPLE = '#A855F7';
const WHITE = '#ffffff';
const WHITE_DIM = 'rgba(255,255,255,0.88)';

type RuleTarget = 'orchestrator' | 'agent' | 'both';

interface RuleEntry {
  id: string;
  target: RuleTarget;
}

type Phase = 'agent-called' | 'constellation' | 'tagline';

interface SceneScaleProps {
  isPlaying?: boolean;
}

interface ExtendedRuleEntry extends RuleEntry {
  writeAction?: boolean;
}

const SPEC_SECTIONS: {
  id: string; label: string; color: string; count: number; desc: string; rules: ExtendedRuleEntry[];
  gridCol: number; gridRow: number;
}[] = [
  { id: 'GRD', label: 'Guardrails & Safety', color: '#f87171', count: 14, desc: 'What the AI must never do',
    gridCol: 0, gridRow: 0,
    rules: [
      { id: 'GRD-04', target: 'orchestrator' },
      { id: 'GRD-05', target: 'orchestrator' },
      { id: 'GRD-06', target: 'both' },
      { id: 'GRD-07', target: 'both' },
      { id: 'GRD-09', target: 'both' },
      { id: 'GRD-11', target: 'agent', writeAction: true },
      { id: 'GRD-13', target: 'both' },
    ] },
  { id: 'ID', label: 'Intent Detection', color: '#fbbf24', count: 8, desc: 'How to interpret what the user wants',
    gridCol: 1, gridRow: 0,
    rules: [
      { id: 'ID-02', target: 'orchestrator' },
      { id: 'ID-05', target: 'orchestrator' },
    ] },
  { id: 'MEM', label: 'Conversation Memory', color: '#c084fc', count: 5, desc: 'What to remember across turns',
    gridCol: 2, gridRow: 0,
    rules: [
      { id: 'MEM-01', target: 'orchestrator' },
      { id: 'MEM-02', target: 'orchestrator' },
      { id: 'MEM-03', target: 'orchestrator' },
    ] },
  { id: 'CTX', label: 'Context Management', color: '#22d3ee', count: 6, desc: 'What context to pass on handoff',
    gridCol: 3, gridRow: 0,
    rules: [
      { id: 'CTX-01', target: 'orchestrator' },
      { id: 'CTX-02', target: 'orchestrator' },
    ] },
  { id: 'TONE', label: 'Tone & Personality', color: '#34d399', count: 4, desc: 'How the AI sounds and feels',
    gridCol: 0, gridRow: 1,
    rules: [
      { id: 'TONE', target: 'agent' },
      { id: 'Voice', target: 'agent' },
    ] },
  { id: 'FMT', label: 'Response Formatting', color: '#818cf8', count: 11, desc: 'How answers are structured',
    gridCol: 1, gridRow: 1,
    rules: [
      { id: 'FMT-01', target: 'both' },
      { id: 'FMT-03', target: 'both' },
      { id: 'FMT-06', target: 'agent', writeAction: true },
    ] },
  { id: 'FB', label: 'Fallback & Recovery', color: '#f472b6', count: 16, desc: 'What to do when things go wrong',
    gridCol: 2, gridRow: 1,
    rules: [
      { id: 'FB-01', target: 'orchestrator' },
      { id: 'FB-03', target: 'orchestrator' },
      { id: 'FB-05', target: 'both' },
      { id: 'FB-09', target: 'orchestrator' },
      { id: 'FB-16', target: 'agent' },
    ] },
  { id: 'RT', label: 'Agent Routing', color: ACCENT, count: 7, desc: 'How to choose the right agent',
    gridCol: 3, gridRow: 1,
    rules: [
      { id: 'RT-01', target: 'orchestrator' },
      { id: 'RT-02', target: 'orchestrator' },
    ] },
];

interface SortedRule extends ExtendedRuleEntry {
  color: string;
  sectionId: string;
  gridCol: number;
  gridRow: number;
}

const ORCH_RULES: SortedRule[] = SPEC_SECTIONS.flatMap(s =>
  s.rules.filter(r => r.target === 'orchestrator' || r.target === 'both')
    .map(r => ({ ...r, color: s.color, sectionId: s.id, gridCol: s.gridCol, gridRow: s.gridRow }))
);
const AGENT_RULES: SortedRule[] = SPEC_SECTIONS.flatMap(s =>
  s.rules.filter(r => r.target === 'agent' || r.target === 'both')
    .map(r => ({ ...r, color: s.color, sectionId: s.id, gridCol: s.gridCol, gridRow: s.gridRow }))
);
const WRITE_ACTION_RULES: SortedRule[] = SPEC_SECTIONS.flatMap(s =>
  s.rules.filter(r => r.writeAction)
    .map(r => ({ ...r, color: s.color, sectionId: s.id, gridCol: s.gridCol, gridRow: s.gridRow }))
);

const AGENTS = [
  { name: 'Schedule Agent', delay: 0.6 },
  { name: 'Benefits Agent', delay: 0.9 },
  { name: 'Payroll Agent', delay: 1.2 },
];

const AGENT_NAMES = [
  'RdyPayrollAgent', 'RdyBenefitsEnrollmentAgent', 'RdySchedulingAgentV3',
  'RdyTalentAcquisitionAgent', 'RdyOnboardingAgent', 'RdyComplianceAgent',
  'RdyPerformanceReviewAgent', 'RdyLearningDevAgent', 'RdyCompensationAgent',
  'RdyEmployeeRelationsAgent', 'RdyWorkforceAnalyticsAgent', 'RdySuccessionPlanAgent',
  'RdyRecruitmentAgent', 'RdyDiversityInclusionAgent', 'RdyEmployeeSelfServiceAgent',
  'RdyManagerSelfServiceAgent', 'RdyOrgChartAgent', 'RdyJobPostingAgent',
  'RdyApplicantTrackingAgent', 'RdyBackgroundCheckAgent', 'RdyI9VerificationAgent',
  'RdyTaxWithholdingAgent', 'RdyDirectDepositAgent', 'RdyGarnishmentAgent',
  'RdyAccrualsAgent', 'RdyTimeOffRequestAgentV4',
  'RdyOpenEnrollmentAgent', 'RdyLifeEventAgent', 'RdyCobraAdminAgent',
  'RdyRetirementPlanAgent', 'RdyHSAManagerAgent', 'RdyFSAManagerAgent',
  'RdyShiftSwapAgent', 'RdyOvertimeApprovalAgent', 'RdyTimesheetAgent',
  'RdyAttendanceTrackingAgent', 'RdyLeaveManagementAgent', 'RdyFMLAAgent',
  'RdyWorkerCompAgent', 'RdySafetyIncidentAgent', 'RdyEquipmentTrackingAgent',
  'RdyExpenseReportAgent', 'RdyTravelRequestAgent', 'RdyPurchaseOrderAgent',
  'RdyGoalSettingAgent', 'Rdy360FeedbackAgent', 'RdyCalibrationAgent',
  'RdyPIPManagementAgent', 'RdyTrainingAssignmentAgent', 'RdyCertificationAgent',
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const BACKGROUND_AGENTS = AGENT_NAMES.filter(n => n !== 'RdyPayrollAgent');

const AGENT_POSITIONS = (() => {
  const rng = seededRandom(99);
  const cardX = 68;
  const cardY = 50;
  const radiusX = 20;
  const radiusY = 34;
  const count = BACKGROUND_AGENTS.length;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return BACKGROUND_AGENTS.map((_, i) => {
    const r = 0.05 + 0.95 * Math.sqrt((i + 0.5) / count);
    const angle = i * goldenAngle + rng() * 0.3;
    const x = cardX + Math.cos(angle) * radiusX * r;
    const y = cardY + Math.sin(angle) * radiusY * r;
    return { x, y };
  });
})();


function FlowRuleTag({ label, color, delay = 0 }: { label: string; color: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        fontFamily: FONT_MONO,
        fontSize: '1.4vh',
        fontWeight: 700,
        padding: '0.5vh 1.2vh',
        borderRadius: 100,
        background: `${color}2e`,
        border: `1.5px solid ${color}73`,
        color,
        letterSpacing: '0.05em',
      }}
    >{label}</motion.span>
  );
}

const SAMPLE_RULE_TAGS: { id: string; color: string }[] = [
  { id: 'GRD-04', color: '#f87171' },
  { id: 'ID-02', color: '#fbbf24' },
  { id: 'MEM-01', color: '#c084fc' },
  { id: 'CTX-03', color: '#22d3ee' },
  { id: 'FMT-01', color: '#818cf8' },
  { id: 'FB-05', color: '#f472b6' },
  { id: 'RT-02', color: '#60CDFF' },
  { id: 'GRD-13', color: '#f87171' },
  { id: 'ID-05', color: '#fbbf24' },
  { id: 'TN-02', color: '#34d399' },
  { id: 'CTX-07', color: '#22d3ee' },
  { id: 'FB-12', color: '#f472b6' },
];
const TOTAL_RULES = 56;

function RuleTagGrid({ delay = 0, totalRules = TOTAL_RULES }: { delay?: number; totalRules?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        padding: '1.2vh 1.5vh',
        borderRadius: 14,
        background: 'rgba(12, 8, 40, 0.85)',
        border: '1.5px solid rgba(134, 41, 255, 0.2)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
        gap: '0.6vh',
        justifyItems: 'center',
        width: 'max-content',
      }}
    >
      {SAMPLE_RULE_TAGS.map((tag, i) => (
        <motion.span
          key={tag.id}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.1 + i * 0.04, duration: 0.25, type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            fontFamily: FONT_MONO,
            fontSize: '1.3vh',
            fontWeight: 700,
            padding: '0.4vh 1vh',
            borderRadius: 100,
            background: `${tag.color}25`,
            border: `1.5px solid ${tag.color}60`,
            color: tag.color,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          {tag.id}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.4 }}
        style={{
          fontFamily: FONT_MONO,
          fontSize: '1.3vh',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.75)',
          padding: '0.4vh 1vh',
          letterSpacing: '0.03em',
        }}
        className="text-[#f1f0ee]">
        +{totalRules - SAMPLE_RULE_TAGS.length} more
      </motion.span>
    </motion.div>
  );
}

export function SceneScale({ isPlaying = true }: SceneScaleProps) {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const rawPhase = params?.get('scalePhase');
  const validPhases: Phase[] = ['agent-called', 'constellation', 'tagline'];
  const startPhase = rawPhase && validPhases.includes(rawPhase as Phase) ? (rawPhase as Phase) : 'agent-called';
  const [phase, setPhase] = useState<Phase>(startPhase);

  const timerEvents = useMemo(() => [
    { time: 12000, callback: () => setPhase('constellation') },
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
      <AnimatePresence mode="wait">
        {phase === 'agent-called' && (
          <motion.div
            key="agent-called"
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ padding: '4vh 5%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: '5.5vh',
                fontWeight: 800,
                color: WHITE,
                margin: 0,
                marginBottom: '2vh',
                textAlign: 'center',
              }}
            >
              Agent Called
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                fontFamily: FONT_CHAT,
                fontSize: '2.8vh',
                color: WHITE_DIM,
                textAlign: 'center',
                marginBottom: '6vh',
              }}
            >
              The agent spec isn't copied — it's injected at runtime
            </motion.p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4vw',
              justifyContent: 'center',
            }}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6, type: 'spring', stiffness: 120 }}
                style={{
                  padding: '3.8vh 4.43vh',
                  borderRadius: 18,
                  background: 'rgba(96,205,255,0.08)',
                  border: '2px solid rgba(96,205,255,0.35)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.52vh',
                }}
              >
                <div style={{
                  width: '7.6vh',
                  height: '7.6vh',
                  borderRadius: '14%',
                  background: 'linear-gradient(135deg, rgba(96,205,255,0.25), rgba(96,205,255,0.08))',
                  border: '2px solid rgba(96,205,255,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: '3.8vh',
                    fontWeight: 800,
                    color: ACCENT,
                  }}>A</span>
                </div>
                <span style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '3.04vh',
                  fontWeight: 700,
                  color: WHITE,
                }}>Agent Spec</span>
              </motion.div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5vh',
                position: 'relative',
              }}>
                {AGENTS.map((agent, i) => (
                  <div key={agent.name} style={{ display: 'flex', alignItems: 'center', gap: '2vw' }}>
                    <div style={{ position: 'relative', width: '8vw', height: '2px' }}>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.6 + i * 0.3, duration: 0.5 }}
                        style={{
                          width: '100%',
                          height: '2px',
                          background: `linear-gradient(90deg, ${ACCENT}40, ${ACCENT})`,
                          transformOrigin: 'left',
                        }}
                      />
                      <motion.div
                        initial={{ left: '0%', opacity: 0 }}
                        animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                        transition={{ delay: 2.1 + i * 0.3, duration: 0.6, ease: 'easeInOut' }}
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
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.0 + i * 0.3, duration: 0.4, type: 'spring', stiffness: 150 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5vw',
                        padding: '1.5vh 2.5vh',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1.5px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <span style={{
                        fontFamily: FONT_CHAT,
                        fontSize: '2.2vh',
                        fontWeight: 600,
                        color: WHITE,
                      }}>{agent.name}</span>

                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 3.0 + i * 0.4, duration: 0.4, type: 'spring', stiffness: 200 }}
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: '1.6vh',
                          fontWeight: 700,
                          padding: '0.3vh 1vh',
                          borderRadius: 6,
                          background: 'rgba(52,211,153,0.15)',
                          border: '1px solid rgba(52,211,153,0.4)',
                          color: '#34d399',
                          letterSpacing: '0.05em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5vh',
                        }}
                      >
                        spec injected
                        <svg width="1.4vh" height="1.4vh" viewBox="0 0 24 24" fill="none">
                          <path d="M7 13l3 3 7-7" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.span>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 5.0, duration: 0.6 }}
              style={{
                fontFamily: FONT_CHAT,
                fontSize: '2vh',
                color: WHITE_DIM,
                textAlign: 'center',
                marginTop: '5vh',
              }}
              className="text-[#ffffffe0] text-[24px] mt-[96px]">
              Update one file, all sixty-seven agents get the change
            </motion.p>
          </motion.div>
        )}

        {phase === 'constellation' && (
          <motion.div
            key="constellation"
            className="absolute inset-0"
            style={{ overflow: 'visible' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                position: 'absolute',
                top: '4vh',
                left: 0,
                right: 0,
                fontFamily: FONT_DISPLAY,
                fontSize: '5.5vh',
                fontWeight: 800,
                color: WHITE,
                margin: 0,
                textAlign: 'center',
                zIndex: 20,
              }}
            >Two Specs - 60+ Agents</motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: '11vh',
                left: 0,
                right: 0,
                fontFamily: FONT_CHAT,
                fontSize: '2.6vh',
                color: WHITE_DIM,
                textAlign: 'center',
                margin: 0,
                zIndex: 20,
              }}
            >
              Crafted and maintained by the design team — always live, never stale
            </motion.p>

            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
            }}>
              {BACKGROUND_AGENTS.map((name, i) => {
                const pos = AGENT_POSITIONS[i];
                const earlyCount = 8;
                const isEarly = i < earlyCount;
                const bulkIndex = i - earlyCount;
                const bulkTotal = BACKGROUND_AGENTS.length - earlyCount;
                const tagDelay = isEarly
                  ? 2.2 + i * 0.25
                  : 5.5 + (1 - Math.pow(1 - bulkIndex / bulkTotal, 0.4)) * 3.0;
                return (
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 0.45, scale: 1 }}
                    transition={{ delay: tagDelay, duration: isEarly ? 0.6 : 0.4 }}
                    style={{
                      position: 'absolute',
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      fontFamily: FONT_MONO,
                      fontSize: '1.1vh',
                      fontWeight: 600,
                      padding: '0.3vh 0.8vh',
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.35)',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {name}
                  </motion.span>
                );
              })}
            </div>

            <div style={{
              position: 'absolute',
              top: '40vh',
              left: '10%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0px',
              width: '94%',
              zIndex: 10,
            }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{
                  padding: '2.5vh 3vh',
                  borderRadius: 18,
                  background: 'rgba(251,146,60,0.08)',
                  border: '2px solid rgba(251,146,60,0.25)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1vh',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: '5vh',
                  height: '5vh',
                  borderRadius: '14%',
                  background: 'linear-gradient(135deg, rgba(251,146,60,0.25), rgba(251,146,60,0.08))',
                  border: '2px solid rgba(251,146,60,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: '2.8vh',
                    fontWeight: 800,
                    color: '#fb923c',
                  }}>?</span>
                </div>
                <span style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '2vh',
                  fontWeight: 700,
                  color: WHITE,
                }}>Query</span>
              </motion.div>

              <div style={{
                position: 'relative',
                width: '5.625vw',
                height: '2px',
                marginTop: '6.5vh',
                marginLeft: '0.5vw',
                marginRight: '0.5vw',
                flexShrink: 0,
              }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  style={{
                    width: '100%',
                    height: '2px',
                    background: `linear-gradient(90deg, ${ACCENT}40, ${ACCENT})`,
                    transformOrigin: 'left',
                  }}
                />
                <motion.div
                  initial={{ left: '0%', opacity: 0 }}
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                  transition={{ delay: 1.3, duration: 0.6, ease: 'easeInOut' }}
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                style={{
                  padding: '2.5vh 3vh',
                  borderRadius: 18,
                  background: 'rgba(222,200,170,0.1)',
                  border: '2px solid rgba(222,200,170,0.25)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1vh',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: '5vh',
                  height: '5vh',
                  borderRadius: '14%',
                  background: 'rgb(245,235,220)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '0.6vh',
                }}>
                  <img
                    src={`${import.meta.env.BASE_URL}bryte-logo.png`}
                    alt="Bryte"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <span style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '2vh',
                  fontWeight: 700,
                  color: WHITE,
                }}>Bryte</span>
              </motion.div>

              <div style={{
                position: 'relative',
                width: '5.625vw',
                height: '2px',
                marginTop: '6.5vh',
                marginLeft: '0.5vw',
                marginRight: '0.5vw',
                flexShrink: 0,
              }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  style={{
                    width: '100%',
                    height: '2px',
                    background: `linear-gradient(90deg, ${ACCENT}40, ${ACCENT})`,
                    transformOrigin: 'left',
                  }}
                />
                <motion.div
                  initial={{ left: '0%', opacity: 0 }}
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                  transition={{ delay: 1.9, duration: 0.6, ease: 'easeInOut' }}
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

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0, alignSelf: 'flex-start', position: 'relative' }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                  style={{
                    padding: '2.5vh 3vh',
                    borderRadius: 18,
                    border: '2px solid rgba(134,41,255,0.3)',
                    background: 'rgba(134,41,255,0.1)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1vh',
                  }}
                >
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
                      fontSize: '2.5vh',
                      fontWeight: 800,
                      color: ACCENT_PURPLE,
                    }}>O</span>
                  </div>
                  <span style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: '2.2vh',
                    fontWeight: 700,
                    color: WHITE,
                  }}>Orchestrator</span>
                </motion.div>

                <div style={{
                  position: 'relative',
                  width: '2px',
                  height: '40px',
                  margin: '0.2vh 0',
                }}>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 2.8, duration: 0.5 }}
                    style={{
                      width: '2px',
                      height: '100%',
                      background: `linear-gradient(0deg, ${ACCENT_PURPLE}40, ${ACCENT_PURPLE})`,
                      transformOrigin: 'bottom',
                    }}
                  />
                  <motion.div
                    initial={{ top: '100%', opacity: 0 }}
                    animate={{ top: ['100%', '0%'], opacity: [0, 1, 1, 0] }}
                    transition={{ delay: 3.2, duration: 0.6, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      left: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: ACCENT_PURPLE,
                      boxShadow: `0 0 12px ${ACCENT_PURPLE}`,
                    }}
                  />
                </div>

                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                  <RuleTagGrid delay={2.4} totalRules={56} />
                </div>
              </div>

              <div style={{
                position: 'relative',
                width: '5.625vw',
                height: '2px',
                marginTop: '6.5vh',
                marginLeft: '0.5vw',
                marginRight: '0.5vw',
                flexShrink: 0,
              }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.1, duration: 0.5 }}
                  style={{
                    width: '100%',
                    height: '2px',
                    background: `linear-gradient(90deg, ${ACCENT}40, ${ACCENT})`,
                    transformOrigin: 'left',
                  }}
                />
                <motion.div
                  initial={{ left: '0%', opacity: 0 }}
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                  transition={{ delay: 2.6, duration: 0.6, ease: 'easeInOut' }}
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

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0, alignSelf: 'flex-start', marginTop: '3vh', position: 'relative' }}>
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 3.2, duration: 0.5, type: 'spring', stiffness: 150, damping: 18 }}
                  style={{
                    padding: '2.5vh 3vh',
                    borderRadius: 18,
                    border: '2px solid rgba(56,189,248,0.3)',
                    background: 'rgba(56,189,248,0.1)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1vh',
                  }}
                >
                  <span style={{
                    fontFamily: FONT_MONO,
                    fontSize: '2vh',
                    fontWeight: 700,
                    color: WHITE,
                    whiteSpace: 'nowrap',
                  }}>RdyPayrollAgent</span>
                </motion.div>

                <div style={{
                  position: 'relative',
                  width: '2px',
                  height: '40px',
                  margin: '0.2vh 0',
                }}>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 4.2, duration: 0.5 }}
                    style={{
                      width: '2px',
                      height: '100%',
                      background: `linear-gradient(0deg, #38BDF840, #38BDF8)`,
                      transformOrigin: 'bottom',
                    }}
                  />
                  <motion.div
                    initial={{ top: '100%', opacity: 0 }}
                    animate={{ top: ['100%', '0%'], opacity: [0, 1, 1, 0] }}
                    transition={{ delay: 4.6, duration: 0.6, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      left: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#38BDF8',
                      boxShadow: `0 0 12px #38BDF8`,
                    }}
                  />
                </div>

                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                  <RuleTagGrid delay={3.8} totalRules={41} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'tagline' && (
          <motion.div
            key="tagline"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ textAlign: 'center', maxWidth: '75vw' }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '4.5vh',
                  fontWeight: 700,
                  color: WHITE,
                  lineHeight: 1.5,
                }}
              >
                One system. Two specs.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '4.5vh',
                  fontWeight: 700,
                  color: ACCENT,
                  lineHeight: 1.5,
                  marginTop: '2vh',
                }}
              >
                Every agent, consistent.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
