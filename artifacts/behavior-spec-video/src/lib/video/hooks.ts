import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    startRecording?: () => Promise<void>;
    stopRecording?: () => void;
  }
}

export interface SceneDurations {
  [key: string]: number;
}

export interface UseVideoPlayerOptions {
  durations: SceneDurations;
  onVideoEnd?: () => void;
  loop?: boolean;
}

export interface UseVideoPlayerReturn {
  currentScene: number;
  totalScenes: number;
  currentSceneKey: string;
  hasEnded: boolean;
  isPlaying: boolean;
  sceneProgress: number;
  elapsedMs: number;
  totalMs: number;
  togglePlayPause: () => void;
  goToScene: (index: number) => void;
  goToSceneAt: (index: number, offsetMs: number) => void;
  seekToMs: (ms: number) => void;
  restart: () => void;
}

export function useVideoPlayer(options: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const { durations, onVideoEnd, loop = true } = options;

  const sceneKeys = useRef(Object.keys(durations)).current;
  const totalScenes = sceneKeys.length;
  const durationsArray = useRef(Object.values(durations)).current;
  const totalMs = useRef(durationsArray.reduce((a, b) => a + b, 0)).current;

  const getInitialScene = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scene = parseInt(params.get('scene') || '0', 10);
      if (scene >= 0 && scene < totalScenes) return scene;
    }
    return 0;
  };

  const [currentScene, setCurrentScene] = useState(getInitialScene);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (typeof window.startRecording === 'function') {
      const result = window.startRecording();
      if (result && typeof result.then === 'function') {
        result.then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(true);
        });
      } else {
        setIsPlaying(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || (hasEnded && !loop)) return;

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setSceneElapsed(prev => {
        const next = prev + delta;
        const sceneDur = durationsArray[currentScene];
        if (next >= sceneDur) {
          if (currentScene >= totalScenes - 1) {
            if (!hasEnded) {
              window.stopRecording?.();
              setHasEnded(true);
              onVideoEnd?.();
            }
            if (loop) {
              setCurrentScene(0);
              return 0;
            }
            clearInterval(interval);
            return sceneDur;
          } else {
            setCurrentScene(s => s + 1);
            return 0;
          }
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentScene, isPlaying, hasEnded, loop, totalScenes, durationsArray, onVideoEnd]);

  const sceneProgress = Math.min(sceneElapsed / durationsArray[currentScene], 1);

  let elapsedMs = sceneElapsed;
  for (let i = 0; i < currentScene; i++) {
    elapsedMs += durationsArray[i];
  }

  const togglePlayPause = useCallback(() => {
    setIsPlaying(p => !p);
  }, []);

  const goToScene = useCallback((index: number) => {
    if (index >= 0 && index < totalScenes) {
      setCurrentScene(index);
      setSceneElapsed(0);
      setIsPlaying(true);
      if (hasEnded) setHasEnded(false);
    }
  }, [totalScenes, hasEnded]);

  const goToSceneAt = useCallback((index: number, offsetMs: number) => {
    if (index >= 0 && index < totalScenes) {
      setCurrentScene(index);
      setSceneElapsed(offsetMs);
      setIsPlaying(true);
      if (hasEnded) setHasEnded(false);
    }
  }, [totalScenes, hasEnded]);

  const restart = useCallback(() => {
    setCurrentScene(0);
    setSceneElapsed(0);
    setHasEnded(false);
    setIsPlaying(true);
  }, []);

  const seekToMs = useCallback((targetMs: number) => {
    const clamped = Math.max(0, Math.min(targetMs, totalMs));
    let accumulated = 0;
    for (let i = 0; i < totalScenes; i++) {
      if (accumulated + durationsArray[i] > clamped) {
        setCurrentScene(i);
        setSceneElapsed(clamped - accumulated);
        if (hasEnded) setHasEnded(false);
        return;
      }
      accumulated += durationsArray[i];
    }
    setCurrentScene(totalScenes - 1);
    setSceneElapsed(durationsArray[totalScenes - 1]);
  }, [totalMs, totalScenes, durationsArray, hasEnded]);

  return {
    currentScene,
    totalScenes,
    currentSceneKey: sceneKeys[currentScene],
    hasEnded,
    isPlaying,
    sceneProgress,
    elapsedMs,
    totalMs,
    togglePlayPause,
    goToScene,
    goToSceneAt,
    seekToMs,
    restart,
  };
}

export function useSceneTimer(events: Array<{ time: number; callback: () => void }>) {
  const firedRef = useRef<Set<number>>(new Set());
  const callbacksRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    callbacksRef.current = events.map(e => e.callback);
  }, [events]);

  const scheduleKey = events.map((event, i) => `${i}:${event.time}`).join('|');

  useEffect(() => {
    firedRef.current = new Set();

    const timers = events.map(({ time }, index) => {
      return setTimeout(() => {
        if (!firedRef.current.has(index)) {
          firedRef.current.add(index);
          callbacksRef.current[index]?.();
        }
      }, time);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [scheduleKey]);
}

export function usePausableElapsed(isPlaying: boolean): number {
  const [elapsed, setElapsed] = useState(0);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (!isPlaying) return;
    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      setElapsed(prev => prev + delta);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return elapsed;
}

export function usePausableTimers(
  isPlaying: boolean,
  events: Array<{ time: number; callback: () => void }>
) {
  const elapsed = usePausableElapsed(isPlaying);
  const firedRef = useRef<Set<number>>(new Set());
  const callbacksRef = useRef(events);

  useEffect(() => {
    callbacksRef.current = events;
  }, [events]);

  useEffect(() => {
    callbacksRef.current.forEach((event, index) => {
      if (elapsed >= event.time && !firedRef.current.has(index)) {
        firedRef.current.add(index);
        event.callback();
      }
    });
  }, [elapsed]);
}

export function usePausableTypewriter(
  isPlaying: boolean,
  fullText: string,
  charDelay: number,
  startDelay: number = 0,
): string {
  const elapsed = usePausableElapsed(isPlaying);
  if (elapsed < startDelay) return '';
  const typingElapsed = elapsed - startDelay;
  const charCount = Math.min(Math.floor(typingElapsed / charDelay), fullText.length);
  return fullText.slice(0, charCount);
}
