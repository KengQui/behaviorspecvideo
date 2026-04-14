import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { usePausableTimers, usePausableTypewriter } from '@/lib/video';

const FONT_CHAT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";

const ACCENT = '#38BDF8';
const ACCENT_DIM = 'rgba(56,189,248,0.6)';
const WHITE = '#ffffff';
const WHITE_DIM = 'rgba(255,255,255,0.7)';
const WHITE_BODY = 'rgba(255,255,255,0.85)';

function XIcon({ size = '3vh' }: { size?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill={WHITE} opacity="0.08" />
      <path d="M8 8l8 8M16 8l-8 8" stroke={WHITE_DIM} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ size = '3vh' }: { size?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill={ACCENT} opacity="0.2" />
      <path d="M7 13l3 3 7-7" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="3vh" height="3vh" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke={WHITE_DIM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpecRuleTag({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 180, damping: 22 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: FONT_MONO,
        fontSize: '2vh',
        fontWeight: 700,
        padding: '0.5vh 1.4vh',
        borderRadius: 100,
        background: 'rgba(56,189,248,0.15)',
        border: '1px solid rgba(56,189,248,0.35)',
        color: ACCENT,
        letterSpacing: '0.05em',
        flexShrink: 0,
      }}
    >
      {label}
    </motion.span>
  );
}

const HIGHLIGHT_PINK = '#FFB6C1';
const HIGHLIGHT_BG = 'rgba(255,182,193,0.3)';

function HighlightWord({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        color: WHITE,
        fontWeight: 700,
        isolation: 'isolate',
      }}
    >
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute',
          left: '-3px',
          right: '-3px',
          bottom: '0',
          height: '60%',
          background: `linear-gradient(180deg, transparent 0%, rgba(255,182,193,0.35) 15%, rgba(255,182,193,0.55) 50%, rgba(255,182,193,0.5) 85%, rgba(255,182,193,0.35) 100%)`,
          borderRadius: '3px',
          transformOrigin: 'left center',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
}

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
  'RdySkillsInventoryAgent', 'RdyCareerPathAgent', 'RdyMentorMatchAgent',
  'RdyExitInterviewAgent', 'RdyOffboardingAgent', 'RdyAlumniNetworkAgent',
  'RdyDocumentManagerAgent', 'RdyPolicyAcknowledgmentAgent', 'RdyAuditTrailAgent',
  'RdyEEOReportingAgent', 'RdyACAComplianceAgent', 'RdyUnionGrievanceAgent',
  'RdyPositionControlAgent', 'RdyHeadcountPlanningAgent', 'RdyBudgetForecastAgent',
  'RdyEngagementSurveyAgent', 'RdyPulseCheckAgent',
];

type Phase = 'typeahead' | 'comparison' | 'why-grid' | 'why-highlight-accruals' | 'why-highlight-both' | 'why-detail' | 'why-detail-highlight' | 'why-detail-explain' | 'why-solution' | 'bottomline';

interface Scene6Props {
  phase?: 'typeahead' | 'comparison' | 'detail';
  onDetailPhase?: () => void;
  onExplainPhase?: () => void;
}

function TypeaheadIntro({ isPlaying = true }: { isPlaying?: boolean }) {
  const QUESTION = "How much PTO have I accrued";
  const CHAR_DELAY = 70;
  const typedText = usePausableTypewriter(isPlaying, QUESTION, CHAR_DELAY, 800);

  return (
    <motion.div
      key="typeahead"
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
            fontSize: '5vh',
            color: WHITE,
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
          </div>
          <div
            style={{
              padding: '1.6vh 2.4vh',
              borderRadius: '18px',
              borderTopRightRadius: '5px',
              background: 'rgba(255,255,255,0.1)',
              fontFamily: FONT_CHAT,
              fontSize: '3.5vh',
              lineHeight: 1.4,
              color: WHITE,
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

export function Scene6({ phase: initialPhase = 'typeahead', isPlaying = true, onDetailPhase, onExplainPhase }: Scene6Props & { isPlaying?: boolean }) {
  const startPhase: Phase = initialPhase === 'typeahead' ? 'typeahead' : initialPhase === 'detail' ? 'why-grid' : 'comparison';
  const [phase, setPhase] = useState<Phase>(startPhase);

  const timerEvents = useMemo(() => {
    if (initialPhase === 'typeahead') return [];
    if (initialPhase === 'detail') return [
      { time: 1500, callback: () => setPhase('why-highlight-accruals') },
      { time: 3000, callback: () => setPhase('why-highlight-both') },
      { time: 6500, callback: () => { setPhase('why-detail'); onDetailPhase?.(); } },
      { time: 12000, callback: () => setPhase('why-detail-highlight') },
      { time: 19000, callback: () => { setPhase('why-detail-explain'); onExplainPhase?.(); } },
      { time: 20500, callback: () => setPhase('why-solution') },
    ];
    return [];
  }, [initialPhase, onDetailPhase, onExplainPhase]);

  usePausableTimers(isPlaying, timerEvents);

  const showTypeahead = phase === 'typeahead';
  const showComparison = phase === 'comparison';
  const showWhyGrid = phase === 'why-grid';
  const showWhyHighlightAccruals = phase === 'why-highlight-accruals';
  const showWhyHighlightBoth = phase === 'why-highlight-both';
  const showWhyHighlight = showWhyHighlightAccruals || showWhyHighlightBoth;
  const showWhyDetail = phase === 'why-detail' || phase === 'why-detail-highlight' || phase === 'why-detail-explain';
  const showPTOHighlight = phase === 'why-detail-highlight';
  const showWhyProblem = showWhyGrid || showWhyHighlight || showWhyDetail;
  const showWhySolution = phase === 'why-solution';
  const showBottomline = phase === 'bottomline';

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
        {showTypeahead && <TypeaheadIntro isPlaying={isPlaying} />}
        {showComparison && (
          <motion.div
            key="comparison"
            className="absolute inset-0 flex flex-col items-center"
            style={{ padding: '3vh 3% 12vh 3%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              style={{ marginBottom: '1.5vh', flexShrink: 0 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 style={{
                fontFamily: FONT_CHAT,
                fontWeight: 800,
                fontSize: '4.5vh',
                color: WHITE,
                margin: 0,
              }}>
                Routing Reliability
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0,
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/routing-comparison.png`}
                alt="Without behavioral spec vs with behavioral spec comparison"
                style={{
                  maxHeight: '100%',
                  maxWidth: '88vw',
                  objectFit: 'contain',
                  borderRadius: '2vh',
                  boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              style={{
                display: 'flex',
                gap: '4vw',
                justifyContent: 'center',
                marginTop: '1.5vh',
                flexShrink: 0,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.2vh',
                padding: '1vh 2.5vh',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <span style={{ fontFamily: FONT_CHAT, fontSize: '3.5vh', fontWeight: 800, color: WHITE_DIM }}>2/3</span>
                <span style={{ fontFamily: FONT_CHAT, fontSize: '2vh', color: WHITE_DIM, fontWeight: 600 }}>failure rate</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.2vh',
                padding: '1vh 2.5vh',
                borderRadius: 12,
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.25)',
              }}>
                <span
                  style={{ fontFamily: FONT_CHAT, fontSize: '3.5vh', fontWeight: 800, color: '#22c55e' }}
                  className="text-[#22c55e]">3/3</span>
                <span style={{ fontFamily: FONT_CHAT, fontSize: '2vh', color: WHITE_BODY, fontWeight: 600 }}>correct routing</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showWhyProblem && (
          <motion.div
            key="why-problem"
            className="absolute inset-0 flex flex-col items-center"
            style={{ padding: '3vh 3% 6vh 3%' }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center"
              style={{ marginBottom: showWhyDetail ? '40px' : 0, flexShrink: 0, width: '100%' }}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2
                style={{
                  fontFamily: FONT_CHAT,
                  fontWeight: 800,
                  fontSize: '5.5vh',
                  color: WHITE,
                  margin: 0,
                  marginTop: '100px',
                }}
              > Overlapping agent descriptions</h2>
            </motion.div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5vh',
                minHeight: 0,
                position: 'relative',
                width: '100%',
              }}
              >
              <AnimatePresence mode="wait">
                {!showWhyDetail ? (
                  <motion.div
                    key="agent-grid-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.8vh',
                      justifyContent: 'center',
                      alignContent: 'center',
                      padding: '2vh 3vw',
                    }}
                    className="pt-[0px] pb-[0px]">
                    {AGENT_NAMES.map((name, i) => {
                      const isAccruals = name === 'RdyAccrualsAgent';
                      const isTimeOff = name === 'RdyTimeOffRequestAgentV4';
                      const accrualActive = showWhyHighlight && isAccruals;
                      const timeOffActive = showWhyHighlightBoth && isTimeOff;
                      const highlighted = accrualActive || timeOffActive;
                      const dimmed = showWhyHighlight && !highlighted;
                      return (
                        <motion.span
                          key={name}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: dimmed ? 0.15 : 1,
                            scale: highlighted ? 1 : (dimmed ? 0.95 : 1),
                          }}
                          transition={highlighted
                            ? { duration: 0.6, ease: 'easeOut' }
                            : { delay: 0.2 + i * 0.012, duration: 0.3 }
                          }
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: highlighted ? '2.2vh' : '1.7vh',
                            fontWeight: highlighted ? 700 : 500,
                            padding: highlighted ? '0.8vh 1.6vh' : '0.5vh 1vh',
                            margin: highlighted ? '0.4vh 0.5vh' : '0',
                            transition: 'font-size 0.6s ease-out, padding 0.6s ease-out, margin 0.6s ease-out, background 0.5s ease, border 0.5s ease, color 0.5s ease, box-shadow 0.5s ease',
                            borderRadius: 8,
                            background: highlighted
                              ? (isAccruals ? 'rgba(56,189,248,0.3)' : 'rgba(255,100,100,0.25)')
                              : 'rgba(255,255,255,0.04)',
                            border: highlighted
                              ? (isAccruals ? '2px solid rgba(56,189,248,0.7)' : '2px solid rgba(255,100,100,0.6)')
                              : '1px solid rgba(255,255,255,0.08)',
                            color: highlighted
                              ? (isAccruals ? ACCENT : '#ff7777')
                              : 'rgba(255,255,255,0.35)',
                            whiteSpace: 'nowrap',
                            zIndex: highlighted ? 10 : 1,
                            position: 'relative',
                            ...(highlighted ? {
                              boxShadow: isAccruals
                                ? '0 0 24px rgba(56,189,248,0.5), 0 0 60px rgba(56,189,248,0.2)'
                                : '0 0 24px rgba(255,100,100,0.4), 0 0 60px rgba(255,100,100,0.15)',
                            } : {}),
                          }}
                        >
                          {name}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="detail-cards"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.5vh',
                      minHeight: 0,
                      width: '100%',
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1.2vh',
                        flexDirection: 'row-reverse' as const,
                        justifyContent: 'center',
                        marginBottom: '0.5vh',
                      }}
                    >
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '0.3vh',
                      }}>
                        <span style={{ fontFamily: FONT_CHAT, fontSize: '1.2vh', fontWeight: 700, color: WHITE_DIM }}>ME</span>
                      </div>
                      <div
                        style={{
                          padding: '1.6vh 2.4vh',
                          borderRadius: '18px',
                          borderTopRightRadius: '5px',
                          background: 'rgba(255,255,255,0.1)',
                          fontFamily: FONT_CHAT,
                          fontSize: '3.6vh',
                          lineHeight: 1.4,
                          color: WHITE,
                          fontWeight: 500,
                        }}
                      >
                        How much <span
                        style={{ fontWeight: 700, color: HIGHLIGHT_PINK }}>PTO</span> have I <span
                        style={{ fontWeight: 700, color: HIGHLIGHT_PINK }}>accrued</span>
                      </div>
                    </motion.div>

                    <div style={{
                      display: 'flex',
                      gap: '2vw',
                      width: '94%',
                      margin: '0 auto',
                      justifyContent: 'center',
                      alignItems: 'stretch',
                    }}>
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{
                          flex: 1,
                          padding: '2vh 2.2vh',
                          borderRadius: 16,
                          background: 'rgba(56,189,248,0.06)',
                          border: '1.5px solid rgba(56,189,248,0.3)',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1vh',
                          marginBottom: '1vh',
                        }}>
                          <CheckIcon size="3.5vh" />
                          <span style={{ fontFamily: FONT_MONO, fontSize: '2.4vh', fontWeight: 700, color: WHITE }}>
                            RdyAccrualsAgent
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontFamily: FONT_CHAT,
                              fontSize: '1.6vh',
                              fontWeight: 700,
                              color: '#7DD3FC',
                              background: 'rgba(56,189,248,0.2)',
                              padding: '0.4vh 1.2vh',
                              borderRadius: 100,
                              letterSpacing: '0.05em',
                            }}>
                            CORRECT
                          </span>
                        </div>
                        <div style={{
                          fontFamily: FONT_CHAT,
                          fontSize: '3vh',
                          color: WHITE_BODY,
                          lineHeight: 1.6,
                          padding: '2.5vh 2.5vh',
                          background: 'rgba(0,0,0,0.2)',
                          borderRadius: 12,
                          borderLeft: '4px solid rgba(56,189,248,0.4)',
                          flex: 1,
                        }}>
                          "An AI agent specialized in viewing{' '}
                          <HighlightWord delay={0.5}>accrual balances</HighlightWord>{' '}
                          and answering{' '}
                          <HighlightWord delay={1.2}>accrual-related</HighlightWord>{' '}
                          queries."
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        style={{
                          flex: 1,
                          padding: '2vh 2.2vh',
                          borderRadius: 16,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1.5px solid rgba(255,255,255,0.12)',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1vh',
                          marginBottom: '1vh',
                        }}>
                          <XIcon size="3.5vh" />
                          <span style={{ fontFamily: FONT_MONO, fontSize: '2.4vh', fontWeight: 700, color: WHITE_DIM }}>
                            RdyTimeOffRequestAgentV4
                          </span>
                          <span style={{
                            marginLeft: 'auto',
                            fontFamily: FONT_CHAT,
                            fontSize: '1.6vh',
                            fontWeight: 700,
                            color: WHITE_DIM,
                            background: 'rgba(255,255,255,0.08)',
                            padding: '0.4vh 1.2vh',
                            borderRadius: 100,
                            letterSpacing: '0.05em',
                          }}>
                            WRONG MATCH
                          </span>
                        </div>
                        <div style={{
                          fontFamily: FONT_CHAT,
                          fontSize: '3vh',
                          color: WHITE_BODY,
                          lineHeight: 1.6,
                          padding: '2.5vh 2.5vh',
                          background: 'rgba(0,0,0,0.2)',
                          borderRadius: 12,
                          borderLeft: '4px solid rgba(255,255,255,0.1)',
                          flex: 1,
                        }}>
                          "An agent that helps employees query and manage Paid Time Off (PTO) requests only, including answering questions about{' '}
                          <HighlightWord delay={1.8}>PTO balances</HighlightWord>."
                        </div>
                      </motion.div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}

        {showWhySolution && (
          <motion.div
            key="why-solution"
            className="absolute inset-0 flex flex-col items-center"
            style={{ padding: '3vh 5% 6vh 5%' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <motion.div
              className="text-center"
              style={{ marginBottom: 0, flexShrink: 0 }}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 style={{
                fontFamily: FONT_CHAT,
                fontWeight: 800,
                fontSize: '4.5vh',
                color: WHITE,
                margin: 0,
                marginTop: '80px',
              }}>
                One key rule: <span style={{ color: ACCENT }}>Disambiguation</span>
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: FONT_CHAT,
                  fontSize: '2.4vh',
                  color: WHITE_DIM,
                  marginTop: '0.8vh',
                }}
              >Full message analysis, not keyword matching</motion.p>
            </motion.div>

            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1vh',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: '3vh',
              minHeight: 0,
            }}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2vh',
                  padding: '2vh 3vh',
                  borderRadius: 14,
                  background: 'rgba(56,189,248,0.06)',
                  border: '2px solid rgba(56,189,248,0.25)',
                  width: '70vw',
                }}
              >
                <span style={{ fontFamily: FONT_CHAT, fontSize: '2.6vh', color: WHITE_BODY }}>
                  "How much PTO have I <HighlightWord>accrued</HighlightWord>"
                </span>
                <ArrowRight />
                <span style={{ fontFamily: FONT_CHAT, fontSize: '2.6vh', color: ACCENT, fontWeight: 700 }}>
                  Accruals Agent
                </span>
                <CheckIcon size="3vh" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                style={{
                  width: '70vw',
                  padding: '2vh 3vh',
                  borderRadius: 14,
                  background: 'rgba(56,189,248,0.06)',
                  border: '2px solid rgba(56,189,248,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2vh',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vh' }}>
                  <SpecRuleTag label="ID-05" delay={1.4} />
                  <span style={{ fontFamily: FONT_CHAT, fontSize: '2.4vh', fontWeight: 700, color: WHITE }}>
                    Intent Disambiguation
                  </span>
                </div>
                <div style={{
                  fontFamily: FONT_CHAT,
                  fontSize: '2.2vh',
                  color: WHITE_BODY,
                  lineHeight: 1.6,
                }}>
                  Analyze the full message and context before deciding whether to route or ask. If intent resolves, route directly. If not, ask exactly one clarifying question with 2–3 options.
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.5 }}
                style={{
                  width: '70vw',
                  display: 'flex',
                  gap: '2vw',
                }}
              >
                <div style={{
                  flex: 1,
                  padding: '1.8vh 2.2vh',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: FONT_CHAT,
                    fontSize: '1.8vh',
                    fontWeight: 700,
                    color: WHITE_DIM,
                    marginBottom: '0.8vh',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.1em',
                  }}>
                    Without spec
                  </div>
                  <div style={{
                    fontFamily: FONT_MONO,
                    fontSize: '2vh',
                    color: WHITE_DIM,
                    lineHeight: 1.5,
                    padding: '1vh 1.5vh',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 8,
                  }}>
                    "I wasn't able to determine the right service..."
                  </div>
                </div>

                <div style={{
                  flex: 1,
                  padding: '1.8vh 2.2vh',
                  borderRadius: 12,
                  background: 'rgba(56,189,248,0.06)',
                  border: '1.5px solid rgba(56,189,248,0.2)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: FONT_CHAT,
                    fontSize: '1.8vh',
                    fontWeight: 700,
                    color: WHITE_DIM,
                    marginBottom: '0.8vh',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.1em',
                  }}>
                    With spec
                  </div>
                  <div style={{
                    fontFamily: FONT_CHAT,
                    fontSize: '2vh',
                    color: WHITE,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    padding: '1vh 1.5vh',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 8,
                  }}>
                    Routed to Accruals Agent — every time.
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
