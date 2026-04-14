import { useState, useRef, useCallback, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;

const SCENE_CONFIG = [
  {
    name: 'Scene 1 — Hook',
    key: 'hook',
    duration: 13000,
    audio: `${BASE}audio/scene1.wav`,
    phases: [],
  },
  {
    name: 'Scene 2 — Context',
    key: 'context',
    duration: 16000,
    audio: `${BASE}audio/scene_transition.wav`,
    phases: [],
  },
  {
    name: 'Scene 3 — Intro',
    key: 'intro',
    duration: 19500,
    audio: `${BASE}audio/scene2.wav`,
    phases: [],
  },
  {
    name: 'Scene 4 — Compare',
    key: 'compare',
    duration: 19000,
    audio: `${BASE}audio/scene3.wav`,
    phases: [
      { time: 1500, label: 'focus-without' },
      { time: 8500, label: 'pause' },
      { time: 9500, label: 'focus-with' },
      { time: 15500, label: 'both' },
    ],
  },
  {
    name: 'Scene 5 — Inconsistency',
    key: 'inconsistency',
    duration: 38500,
    audio: `${BASE}audio/scene4.wav`,
    phases: [
      { time: 7500, label: 'headline' },
      { time: 8000, label: 'attempt1' },
      { time: 13000, label: 'attempt2' },
      { time: 18000, label: 'attempt3' },
      { time: 23000, label: 'transition' },
      { time: 25000, label: 'payoff' },
    ],
  },
  {
    name: 'Scene 6 — Closing',
    key: 'closing',
    duration: 3000,
    audio: `${BASE}audio/scene5.wav`,
    phases: [],
  },
  {
    name: 'Agent Spec C1 — Receive + Guardrails',
    key: 'agent-c1',
    duration: 12000,
    audio: `${BASE}audio/scene7b_c1.wav`,
    phases: [
      { time: 0, label: 'receive' },
      { time: 5000, label: 'guardrails-tone' },
    ],
  },
  {
    name: 'Agent Spec C2 — Work',
    key: 'agent-c2',
    duration: 4000,
    audio: `${BASE}audio/scene7b_c2.wav`,
    phases: [
      { time: 0, label: 'work' },
    ],
  },
  {
    name: 'Agent Spec C3 — Formatting',
    key: 'agent-c3',
    duration: 9000,
    audio: `${BASE}audio/scene7b_c3.wav`,
    phases: [
      { time: 0, label: 'formatting' },
    ],
  },
  {
    name: 'Agent Spec C4 — Fallback + Handback',
    key: 'agent-c4',
    duration: 11000,
    audio: `${BASE}audio/scene7b_c4.wav`,
    phases: [
      { time: 0, label: 'fallback' },
      { time: 5000, label: 'handback' },
    ],
  },
];

interface SceneRowProps {
  scene: typeof SCENE_CONFIG[0];
  index: number;
  audioDelay: number;
  onDelayChange: (index: number, delay: number) => void;
  audioDuration: number | null;
  onLoadAudioDuration: (index: number, dur: number) => void;
}

function SceneRow({ scene, index, audioDelay, onDelayChange, audioDuration, onLoadAudioDuration }: SceneRowProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playStartRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = new Audio(scene.audio);
    audio.addEventListener('loadedmetadata', () => {
      onLoadAudioDuration(index, audio.duration * 1000);
    });
    audio.load();
    return () => { audio.remove(); };
  }, [scene.audio, index, onLoadAudioDuration]);

  const stopPlayback = useCallback(() => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
    }
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    stopPlayback();
    setIsPlaying(true);
    playStartRef.current = Date.now();

    const audio = new Audio(scene.audio);
    audioRef.current = audio;

    if (audioDelay > 0) {
      playTimerRef.current = setTimeout(() => {
        audio.play().catch(() => {});
      }, audioDelay);
    } else {
      audio.currentTime = Math.abs(audioDelay) / 1000;
      audio.play().catch(() => {});
    }

    const tick = () => {
      const elapsed = Date.now() - playStartRef.current;
      const pct = Math.min((elapsed / scene.duration) * 100, 100);
      if (progressRef.current) {
        progressRef.current.style.width = `${pct}%`;
      }
      if (elapsed < scene.duration) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        stopPlayback();
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [scene, audioDelay, stopPlayback]);

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const clickedMs = pct * scene.duration;

    stopPlayback();
    setIsPlaying(true);
    playStartRef.current = Date.now() - clickedMs;

    const audio = new Audio(scene.audio);
    audioRef.current = audio;

    const audioStartMs = clickedMs - audioDelay;
    if (audioStartMs >= 0 && audioDuration && audioStartMs < audioDuration) {
      audio.currentTime = audioStartMs / 1000;
      audio.play().catch(() => {});
    } else if (audioStartMs < 0) {
      playTimerRef.current = setTimeout(() => {
        audio.play().catch(() => {});
      }, Math.abs(audioStartMs));
    }

    const tick = () => {
      const elapsed = Date.now() - playStartRef.current;
      const pct = Math.min((elapsed / scene.duration) * 100, 100);
      if (progressRef.current) {
        progressRef.current.style.width = `${pct}%`;
      }
      if (elapsed < scene.duration) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        stopPlayback();
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [scene, audioDelay, audioDuration, stopPlayback, isDragging]);

  const audioLeftPct = (audioDelay / scene.duration) * 100;
  const audioWidthPct = audioDuration ? (audioDuration / scene.duration) * 100 : 0;

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const startDelay = audioDelay;
    const timeline = e.currentTarget.closest('[data-timeline]') as HTMLElement;
    if (!timeline) return;
    const timelineWidth = timeline.getBoundingClientRect().width;

    const onMove = (me: MouseEvent) => {
      const dx = me.clientX - startX;
      const dMs = (dx / timelineWidth) * scene.duration;
      const newDelay = Math.max(-5000, Math.min(scene.duration, Math.round(startDelay + dMs)));
      onDelayChange(index, newDelay);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setTimeout(() => setIsDragging(false), 50);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [audioDelay, scene.duration, index, onDelayChange]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff' }}>
            {scene.name}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            {(scene.duration / 1000).toFixed(1)}s
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={isPlaying ? stopPlayback : startPlayback}
            style={{
              background: isPlaying ? 'rgba(255,80,80,0.2)' : 'rgba(134,41,255,0.2)',
              border: isPlaying ? '1px solid rgba(255,80,80,0.4)' : '1px solid rgba(134,41,255,0.4)',
              borderRadius: 8,
              padding: '6px 16px',
              color: '#fff',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>
      </div>

      <div
        data-timeline
        style={{
          position: 'relative',
          height: 56,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 8,
          overflow: 'visible',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        onClick={handleTimelineClick}
      >
        <div
          ref={progressRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            background: 'rgba(134,41,255,0.15)',
            borderRadius: '8px 0 0 8px',
            width: '0%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {audioDuration !== null && (
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: `${Math.max(audioLeftPct, 0)}%`,
              width: `${Math.min(audioWidthPct, 100 - Math.max(audioLeftPct, 0))}%`,
              height: 20,
              background: 'linear-gradient(90deg, rgba(109,170,242,0.35), rgba(109,170,242,0.15))',
              borderRadius: 4,
              border: '1px solid rgba(109,170,242,0.4)',
              zIndex: 2,
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 6,
            }}
            onMouseDown={handleDragStart}
          >
            <span style={{ fontSize: 10, color: 'rgba(109,170,242,0.9)', fontFamily: "'JetBrains Mono', monospace", pointerEvents: 'none', userSelect: 'none' }}>
              Audio {audioDuration ? `(${(audioDuration / 1000).toFixed(1)}s)` : ''}
            </span>
          </div>
        )}

        {scene.phases.map((phase, i) => {
          const leftPct = (phase.time / scene.duration) * 100;
          return (
            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${leftPct}%`, zIndex: 3, pointerEvents: 'none' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 1,
                background: 'rgba(255,255,255,0.25)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: 4,
                left: 4,
                fontSize: 9,
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}>
                {phase.label}
              </div>
            </div>
          );
        })}

        {[0.25, 0.5, 0.75].map(pct => (
          <div key={pct} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${pct * 100}%`,
            width: 1,
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }}>
            <span style={{
              position: 'absolute',
              top: 2,
              left: 4,
              fontSize: 9,
              color: 'rgba(255,255,255,0.2)',
              fontFamily: "'JetBrains Mono', monospace",
              userSelect: 'none',
            }}>
              {(pct * scene.duration / 1000).toFixed(0)}s
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", minWidth: 80 }}>
          Audio delay:
        </span>
        <input
          type="range"
          min={-5000}
          max={Math.round(scene.duration * 0.8)}
          step={100}
          value={audioDelay}
          onChange={e => onDelayChange(index, parseInt(e.target.value))}
          style={{ flex: 1, accentColor: '#6DAAF2', cursor: 'pointer' }}
        />
        <input
          type="number"
          value={audioDelay}
          onChange={e => onDelayChange(index, parseInt(e.target.value) || 0)}
          step={100}
          style={{
            width: 80,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '4px 8px',
            color: '#fff',
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: 'right',
          }}
        />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>ms</span>
      </div>
    </div>
  );
}

export function SyncEditor() {
  const [audioDelays, setAudioDelays] = useState<number[]>(
    SCENE_CONFIG.map((_, i) => {
      if (i === 4) return 1500;
      return 0;
    })
  );
  const [audioDurations, setAudioDurations] = useState<(number | null)[]>(
    SCENE_CONFIG.map(() => null)
  );
  const [copied, setCopied] = useState(false);

  const handleDelayChange = useCallback((index: number, delay: number) => {
    setAudioDelays(prev => {
      const next = [...prev];
      next[index] = delay;
      return next;
    });
  }, []);

  const handleLoadAudioDuration = useCallback((index: number, dur: number) => {
    setAudioDurations(prev => {
      const next = [...prev];
      next[index] = dur;
      return next;
    });
  }, []);

  const exportConfig = useCallback(() => {
    const config: Record<number, number> = {};
    audioDelays.forEach((d, i) => {
      if (d !== 0) config[i] = d;
    });
    const code = `const AUDIO_DELAYS: Record<number, number> = ${JSON.stringify(config)};`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [audioDelays]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0C0820',
      overflow: 'auto',
      padding: '32px 40px',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              margin: 0,
            }}>
              Audio Sync Editor
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
              margin: '6px 0 0',
            }}>
              Drag the blue audio bar or use the slider to adjust when audio starts relative to the scene. Click the timeline to preview from any point.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={exportConfig}
              style={{
                background: copied ? 'rgba(21,128,61,0.3)' : 'rgba(134,41,255,0.2)',
                border: copied ? '1px solid rgba(21,128,61,0.5)' : '1px solid rgba(134,41,255,0.4)',
                borderRadius: 8,
                padding: '8px 20px',
                color: '#fff',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              {copied ? 'Copied!' : 'Copy Config'}
            </button>
            <a
              href={`${BASE}`}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '8px 20px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Back to Video
            </a>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 24,
          marginBottom: 24,
          padding: '16px 20px',
          background: 'rgba(109,170,242,0.08)',
          borderRadius: 10,
          border: '1px solid rgba(109,170,242,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 4, background: 'rgba(109,170,242,0.5)', borderRadius: 2 }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>Audio track (drag to reposition)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>Visual phase markers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 14, background: 'rgba(134,41,255,0.15)', borderRadius: 2 }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>Playback position</span>
          </div>
        </div>

        {SCENE_CONFIG.map((scene, i) => (
          <SceneRow
            key={i}
            scene={scene}
            index={i}
            audioDelay={audioDelays[i]}
            onDelayChange={handleDelayChange}
            audioDuration={audioDurations[i]}
            onLoadAudioDuration={handleLoadAudioDuration}
          />
        ))}

        <div style={{
          marginTop: 24,
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
            Current config (paste into VideoTemplate.tsx):
          </div>
          <code style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            color: 'rgba(109,170,242,0.9)',
            display: 'block',
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 6,
            userSelect: 'all',
          }}>
            {`const AUDIO_DELAYS: Record<number, number> = ${JSON.stringify(
              audioDelays.reduce((acc, d, i) => {
                if (d !== 0) acc[i] = d;
                return acc;
              }, {} as Record<number, number>)
            )};`}
          </code>
        </div>
      </div>
    </div>
  );
}
