import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Scene1 } from './Scene1';
import { SceneTransition } from './SceneTransition';
import { Scene2 } from './Scene2';
import { Scene3 } from './Scene3';
import { Scene4 } from './Scene4';
import { Scene5 } from './Scene5';
import { Scene6 } from './Scene6';
import { SceneScale } from './SceneScale';
import { SceneInsideSpec } from './SceneInsideSpec';
import { Scene7 } from './Scene7';
import { Scene8 } from './Scene8';
import { SceneTitle } from './SceneTitle';
import { MergeAudio } from './MergeAudio';

const SCENE_DURATIONS = {
  title: 3000,
  hook: 17000,
  context: 25000,
  intro: 44000,
  compare: 22500,
  inconsistency: 38500,
  routingTypeahead: 4500,
  routingComparison: 7000,
  routingDetail: 39500,
  insideSpec: 39000,
  scale: 25000,
  orchPart1: 40000,
  orchMemory: 21800,
  orchTone: 10000,
  orchRouting: 6000,
  agentC1: 17200,
  agentC2: 4000,
  agentC3: 5000,
  agentC4: 12000,
  closing: 23000,
};

const SCENE_LABELS = ['Title', 'Hook', 'Context', 'Intro', 'Compare', 'Inconsistency', 'Typeahead', 'Routing', 'Why It Fails', 'Inside Spec', 'Scale', 'Orch: Query', 'Orch: Memory', 'Orch: Tone', 'Orch: Route', 'Agent: Guardrails', 'Agent: Work', 'Agent: Format', 'Agent: Fallback', 'Closing'];

const BASE = import.meta.env.BASE_URL;
const COMBINED_AUDIO_URL = `${BASE}combined-audio-v2.mp3`;


const accentPositions = [
  { x: '50%', y: '40%', scale: 2.2, opacity: 0.12 },
  { x: '10%', y: '20%', scale: 2, opacity: 0.15 },
  { x: '40%', y: '30%', scale: 1.8, opacity: 0.18 },
  { x: '70%', y: '10%', scale: 1.5, opacity: 0.2 },
  { x: '30%', y: '60%', scale: 1.8, opacity: 0.12 },
  { x: '60%', y: '30%', scale: 1, opacity: 0.18 },
  { x: '50%', y: '35%', scale: 1.8, opacity: 0.14 },
  { x: '20%', y: '25%', scale: 1.6, opacity: 0.16 },
  { x: '35%', y: '45%', scale: 1.4, opacity: 0.16 },
  { x: '55%', y: '25%', scale: 1.6, opacity: 0.17 },
  { x: '45%', y: '35%', scale: 1.5, opacity: 0.14 },
  { x: '15%', y: '35%', scale: 1.6, opacity: 0.16 },
  { x: '25%', y: '40%', scale: 1.5, opacity: 0.15 },
  { x: '35%', y: '30%', scale: 1.4, opacity: 0.16 },
  { x: '45%', y: '25%', scale: 1.5, opacity: 0.14 },
  { x: '55%', y: '25%', scale: 1.5, opacity: 0.15 },
  { x: '45%', y: '30%', scale: 1.4, opacity: 0.14 },
  { x: '35%', y: '35%', scale: 1.5, opacity: 0.15 },
  { x: '50%', y: '20%', scale: 1.6, opacity: 0.14 },
  { x: '40%', y: '40%', scale: 2.5, opacity: 0.1 },
];

const DURATIONS_ARRAY = Object.values(SCENE_DURATIONS);

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '2vh', height: '2vh', marginLeft: '0.3vh' }}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '2vh', height: '2vh' }}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '2vh', height: '2vh' }}>
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '2vh', height: '2vh' }}>
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.8vh', height: '1.8vh' }}>
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '2vh', height: '2vh' }}>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.49 4.49 0 002.5-3.5zM14 3.23v2.06a7.007 7.007 0 010 13.42v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '2vh', height: '2vh' }}>
      <path d="M16.5 12A4.5 4.5 0 0014 8.5v2.09l2.5 2.5V12zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

export default function VideoTemplate() {
  const player = useVideoPlayer({ durations: SCENE_DURATIONS, loop: false });
  const {
    currentScene,
    totalScenes,
    isPlaying,
    sceneProgress,
    elapsedMs,
    totalMs,
    togglePlayPause,
    goToScene,
    seekToMs,
    restart,
  } = player;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showMerge, setShowMerge] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioReadyRef = useRef(false);
  const elapsedMsRef = useRef(elapsedMs);
  elapsedMsRef.current = elapsedMs;

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = COMBINED_AUDIO_URL;
    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => {
      audioReadyRef.current = true;
      setAudioReady(true);
    });

    audio.addEventListener('error', () => {
      console.error('Audio failed to load:', COMBINED_AUDIO_URL);
    });

    audio.load();

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const tryPlayAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const targetTime = elapsedMs / 1000;
    audio.currentTime = targetTime;
    audio.play().then(() => {
      setAudioEnabled(true);
    }).catch(() => {});
  }, [elapsedMs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isPlaying) {
      audio.pause();
    } else {
      const targetTime = elapsedMsRef.current / 1000;
      audio.currentTime = targetTime;
      audio.play().then(() => {
        setAudioEnabled(true);
      }).catch(() => {});
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : 1.0;
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying || !audioEnabled) return;
    const targetTime = elapsedMs / 1000;
    if (Math.abs(audio.currentTime - targetTime) > 0.3) {
      audio.currentTime = targetTime;
    }
  }, [currentScene, audioEnabled]);

  useEffect(() => {
    if (!isPlaying || !audioEnabled) return;
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const targetTime = elapsedMsRef.current / 1000;
      if (Math.abs(audio.currentTime - targetTime) > 0.3) {
        audio.currentTime = targetTime;
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, audioEnabled]);

  const enableAudio = useCallback(() => {
    tryPlayAudio();
  }, [tryPlayAudio]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 4000);
    }
  }, [isPlaying]);

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [showControls]);

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [isPlaying]);

  

  const toggleMute = useCallback(() => {
    if (!audioReady) return;
    if (!audioEnabled) {
      enableAudio();
      return;
    }
    setIsMuted(m => !m);
  }, [audioReady, audioEnabled, enableAudio]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden"
      onMouseMove={showControls}
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '16/9',
          width: '100vw',
          maxWidth: '100vw',
          height: 'min(100vh, calc(100vw * 9 / 16))',
          background: 'linear-gradient(160deg, #0C0820 0%, #1E1652 40%, #0C0820 100%)',
        }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '40%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            left: accentPositions[currentScene].x,
            top: accentPositions[currentScene].y,
            scale: accentPositions[currentScene].scale,
            opacity: accentPositions[currentScene].opacity,
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          className="absolute rounded-full"
          style={{
            width: '35%',
            height: '50%',
            background: 'radial-gradient(circle, rgba(48,37,141,0.4), transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: ['0%', '30%', '-10%'],
            y: ['40%', '10%', '50%'],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute"
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)',
          }}
          initial={{ left: '0%', width: '60%', top: '45%', opacity: 0.4 }}
          animate={{
            left: ['50%', '0%', '30%', '20%', '60%', '10%', '40%', '15%', '30%', '45%', '25%', '15%', '15%', '15%', '15%', '15%', '15%', '15%', '15%', '20%'][currentScene],
            width: ['0%', '60%', '50%', '40%', '80%', '50%', '45%', '55%', '60%', '0%', '50%', '50%', '50%', '50%', '50%', '50%', '50%', '50%', '50%', '60%'][currentScene],
            top: ['50%', '45%', '50%', '15%', '55%', '35%', '50%', '40%', '45%', '30%', '35%', '28%', '28%', '28%', '28%', '28%', '28%', '28%', '28%', '45%'][currentScene],
            opacity: [0, 0.4, 0.5, 0, 0.3, 0.5, 0.4, 0.45, (() => { const sceneStart = DURATIONS_ARRAY.slice(0, 8).reduce((a, b) => a + b, 0); const sceneLocal = elapsedMs - sceneStart; return sceneLocal >= 7500 ? 0 : 0.35; })(), 0, 0, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.4][currentScene],
          }}
          transition={currentScene <= 1 ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        <AnimatePresence mode="popLayout">
          {currentScene === 0 && <SceneTitle key="title" isPlaying={isPlaying} />}
          {currentScene === 1 && <Scene1 key="hook" isPlaying={isPlaying} />}
          {currentScene === 2 && <SceneTransition key="context" isPlaying={isPlaying} />}
          {currentScene === 3 && <Scene2 key="intro" isPlaying={isPlaying} />}
          {currentScene === 4 && <Scene3 key="compare" isPlaying={isPlaying} />}
          {currentScene === 5 && <Scene4 key="analysis" isPlaying={isPlaying} />}
          {currentScene === 6 && <Scene6 key="routing-typeahead" phase="typeahead" isPlaying={isPlaying} />}
          {currentScene === 7 && <Scene6 key="routing-comparison" phase="comparison" isPlaying={isPlaying} />}
          {currentScene === 8 && <Scene6 key="routing-detail" phase="detail" isPlaying={isPlaying} />}
          {currentScene === 9 && <SceneInsideSpec key="inside-spec" isPlaying={isPlaying} />}
          {currentScene === 10 && <SceneScale key="scale" isPlaying={isPlaying} />}
          {currentScene === 11 && <Scene7 key="orch-part1" isPlaying={isPlaying} initialPhase="query" />}
          {currentScene === 12 && <Scene7 key="orch-memory" isPlaying={isPlaying} initialPhase="memory-compound" />}
          {currentScene === 13 && <Scene7 key="orch-tone" isPlaying={isPlaying} initialPhase="tone" />}
          {currentScene === 14 && <Scene7 key="orch-routing" isPlaying={isPlaying} initialPhase="routing" />}
          {currentScene === 15 && <Scene8 key="agent-c1" clip="c1" isPlaying={isPlaying} />}
          {currentScene === 16 && <Scene8 key="agent-c2" clip="c2" isPlaying={isPlaying} />}
          {currentScene === 17 && <Scene8 key="agent-c3" clip="c3" isPlaying={isPlaying} />}
          {currentScene === 18 && <Scene8 key="agent-c4" clip="c4" isPlaying={isPlaying} />}
          {currentScene === 19 && <Scene5 key="closing" isPlaying={isPlaying} />}
        </AnimatePresence>

        <AnimatePresence>
          {controlsVisible && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              style={{
                background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                padding: '5vh 2.5vh 1.5vh',
              }}
            >
              <div
                className="relative cursor-pointer"
                style={{
                  height: '0.6vh',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.2)',
                  overflow: 'visible',
                  marginBottom: '1vh',
                  position: 'relative',
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  seekToMs(fraction * totalMs);
                  const audio = audioRef.current;
                  if (audio && audioEnabled) {
                    audio.currentTime = (fraction * totalMs) / 1000;
                  }
                }}
                onMouseDown={(e) => {
                  const bar = e.currentTarget;
                  const onMove = (ev: MouseEvent) => {
                    const rect = bar.getBoundingClientRect();
                    const fraction = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                    seekToMs(fraction * totalMs);
                  };
                  const onUp = () => {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                    const audio = audioRef.current;
                    if (audio && audioEnabled) {
                      audio.currentTime = elapsedMsRef.current / 1000;
                    }
                  };
                  document.addEventListener('mousemove', onMove);
                  document.addEventListener('mouseup', onUp);
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: '999px',
                    background: '#8629FF',
                    width: `${(elapsedMs / totalMs) * 100}%`,
                    transition: 'width 0.1s linear',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    left: `${(elapsedMs / totalMs) * 100}%`,
                    width: '1.4vh',
                    height: '1.4vh',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 0 4px rgba(0,0,0,0.4)',
                    transition: 'left 0.1s linear',
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: '1.2vh' }}>
                  <button onClick={() => goToScene(Math.max(0, currentScene - 1))} className="cursor-pointer" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', padding: '0.5vh' }}>
                    <PrevIcon />
                  </button>

                  <button onClick={togglePlayPause} className="cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '4vh', height: '4vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>

                  <button onClick={() => goToScene(Math.min(totalScenes - 1, currentScene + 1))} className="cursor-pointer" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', padding: '0.5vh' }}>
                    <NextIcon />
                  </button>

                  <button onClick={restart} className="cursor-pointer" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', padding: '0.5vh' }}>
                    <RestartIcon />
                  </button>

                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.4vh', fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(elapsedMs)} / {formatTime(totalMs)}
                  </span>

                  <button onClick={toggleMute} disabled={!audioReady} className="cursor-pointer flex items-center" style={{ background: audioEnabled && !isMuted ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.1)', border: audioEnabled && !isMuted ? '1px solid rgba(56,189,248,0.6)' : '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '0.5vh 1.2vh', color: '#fff', gap: '0.6vh', fontSize: '1.3vh', fontFamily: "'DM Sans', sans-serif", opacity: audioReady ? 1 : 0.5, cursor: audioReady ? 'pointer' : 'default' }}>
                    {audioEnabled && !isMuted ? <VolumeOnIcon /> : <VolumeOffIcon />}
                    {!audioEnabled ? (audioReady ? 'Enable audio' : 'Loading audio...') : isMuted ? 'Unmute' : 'Audio on'}
                  </button>
                </div>

                <div className="flex items-center" style={{ gap: '1.5vh' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.3vh', fontFamily: "'DM Sans', sans-serif" }}>
                    {SCENE_LABELS[currentScene]}
                  </span>

                  <button onClick={() => setShowMerge(true)} className="cursor-pointer flex items-center" style={{ background: 'rgba(134,41,255,0.3)', border: '1px solid rgba(134,41,255,0.5)', borderRadius: '999px', padding: '0.5vh 1.2vh', color: '#fff', gap: '0.6vh', fontSize: '1.3vh', fontFamily: "'DM Sans', sans-serif" }}>
                    Add Audio to Export
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showMerge && <MergeAudio onClose={() => setShowMerge(false)} />}
      </div>
    </div>
  );
}
