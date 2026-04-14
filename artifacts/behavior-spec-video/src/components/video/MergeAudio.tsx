import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const BASE = import.meta.env.BASE_URL;
const AUDIO_URL = `${BASE}combined-audio-v2.mp3`;

type MergeState = 'idle' | 'processing' | 'done' | 'error';
type Step = 'init' | 'video' | 'audio' | 'merge';

const STEP_LABELS: Record<Step, string> = {
  init: 'Loading audio processor',
  video: 'Reading video file',
  audio: 'Downloading audio track',
  merge: 'Merging audio with video',
};

const STEPS: Step[] = ['init', 'video', 'audio', 'merge'];

export function MergeAudio({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<MergeState>('idle');
  const [step, setStep] = useState<Step>('init');
  const [percent, setPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleMerge = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setErrorMsg('Please select a video file first.');
      setState('error');
      return;
    }

    try {
      setState('processing');
      setStep('init');
      setPercent(0);

      console.log('[MergeAudio] Starting merge process');
      console.log('[MergeAudio] Input file:', file.name, 'size:', (file.size / 1024 / 1024).toFixed(2), 'MB');

      const ffmpeg = new FFmpeg();

      ffmpeg.on('log', ({ message }) => {
        console.log('[ffmpeg]', message);
      });

      ffmpeg.on('progress', ({ progress, time }) => {
        const pct = Math.min(99, Math.round(progress * 100));
        console.log('[MergeAudio] Merge progress:', pct + '%', 'time:', time);
        setPercent(pct);
      });

      const coreURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js';
      const wasmURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm';

      console.log('[MergeAudio] Step 1/4: Downloading ffmpeg WASM from', wasmURL);
      const wasmStart = performance.now();
      const wasmResp = await fetch(wasmURL);
      const wasmTotal = Number(wasmResp.headers.get('content-length') || 0);
      console.log('[MergeAudio] WASM response status:', wasmResp.status, 'content-length:', wasmTotal);
      if (!wasmResp.ok) throw new Error('Failed to download audio processor (HTTP ' + wasmResp.status + ')');
      const wasmReader = wasmResp.body!.getReader();
      const wasmChunks: Uint8Array[] = [];
      let wasmLoaded = 0;
      while (true) {
        const { done, value } = await wasmReader.read();
        if (done) break;
        wasmChunks.push(value);
        wasmLoaded += value.length;
        if (wasmTotal > 0) setPercent(Math.round((wasmLoaded / wasmTotal) * 100));
      }
      console.log('[MergeAudio] WASM downloaded:', (wasmLoaded / 1024 / 1024).toFixed(2), 'MB in', ((performance.now() - wasmStart) / 1000).toFixed(1) + 's');
      const wasmBuf = new Uint8Array(wasmLoaded);
      let wOff = 0;
      for (const c of wasmChunks) { wasmBuf.set(c, wOff); wOff += c.length; }
      const wasmBlob = new Blob([wasmBuf], { type: 'application/wasm' });
      const wasmBlobURL = URL.createObjectURL(wasmBlob);

      console.log('[MergeAudio] Initializing ffmpeg engine...');
      const loadStart = performance.now();
      await ffmpeg.load({
        coreURL,
        wasmURL: wasmBlobURL,
        workerURL: 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.15/dist/esm/worker.js',
      });
      URL.revokeObjectURL(wasmBlobURL);
      console.log('[MergeAudio] ffmpeg loaded in', ((performance.now() - loadStart) / 1000).toFixed(1) + 's');

      console.log('[MergeAudio] Step 2/4: Reading video file...');
      setStep('video');
      setPercent(0);
      const videoStart = performance.now();
      const videoBuf = await file.arrayBuffer();
      console.log('[MergeAudio] Video read into memory:', (videoBuf.byteLength / 1024 / 1024).toFixed(2), 'MB in', ((performance.now() - videoStart) / 1000).toFixed(1) + 's');
      setPercent(50);
      await ffmpeg.writeFile('input.mp4', new Uint8Array(videoBuf));
      setPercent(100);
      console.log('[MergeAudio] Video written to ffmpeg filesystem');

      console.log('[MergeAudio] Step 3/4: Downloading audio track from', AUDIO_URL);
      setStep('audio');
      setPercent(0);
      const audioStart = performance.now();
      const audioResp = await fetch(AUDIO_URL);
      console.log('[MergeAudio] Audio response status:', audioResp.status, 'content-length:', audioResp.headers.get('content-length'));
      if (!audioResp.ok) throw new Error('Failed to download audio track (HTTP ' + audioResp.status + ')');
      const contentLength = Number(audioResp.headers.get('content-length') || 0);
      const audioReader = audioResp.body!.getReader();
      const audioChunks: Uint8Array[] = [];
      let audioLoaded = 0;
      while (true) {
        const { done, value } = await audioReader.read();
        if (done) break;
        audioChunks.push(value);
        audioLoaded += value.length;
        if (contentLength > 0) setPercent(Math.round((audioLoaded / contentLength) * 100));
      }
      console.log('[MergeAudio] Audio downloaded:', (audioLoaded / 1024 / 1024).toFixed(2), 'MB in', ((performance.now() - audioStart) / 1000).toFixed(1) + 's');
      const audioBuf = new Uint8Array(audioLoaded);
      let aOff = 0;
      for (const c of audioChunks) { audioBuf.set(c, aOff); aOff += c.length; }
      await ffmpeg.writeFile('audio.mp3', audioBuf);
      console.log('[MergeAudio] Audio written to ffmpeg filesystem');

      console.log('[MergeAudio] Step 4/4: Merging audio with video...');
      setStep('merge');
      setPercent(0);
      const mergeStart = performance.now();

      const ffmpegArgs = [
        '-i', 'input.mp4',
        '-i', 'audio.mp3',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-movflags', '+faststart',
        'output.mp4',
      ];
      console.log('[MergeAudio] ffmpeg args:', ffmpegArgs.join(' '));

      await ffmpeg.exec(ffmpegArgs);

      console.log('[MergeAudio] Merge completed in', ((performance.now() - mergeStart) / 1000).toFixed(1) + 's');
      setPercent(100);

      console.log('[MergeAudio] Reading output file...');
      const outputData = await ffmpeg.readFile('output.mp4');
      const outputSize = (outputData as Uint8Array).length;
      console.log('[MergeAudio] Output file size:', (outputSize / 1024 / 1024).toFixed(2), 'MB');

      const blob = new Blob([outputData], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video-with-audio.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      ffmpeg.terminate();
      console.log('[MergeAudio] Done! Total time:', ((performance.now() - wasmStart) / 1000).toFixed(1) + 's');

      setState('done');
    } catch (err: any) {
      console.error('[MergeAudio] Error:', err);
      console.error('[MergeAudio] Error stack:', err.stack);
      setState('error');
      setErrorMsg(err.message || 'Failed to merge audio');
    }
  };

  const stepIndex = STEPS.indexOf(step);

  const progressBar = (
    <div style={{ width: '100%', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{STEP_LABELS[step]}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>{percent}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #8629FF, #56CCF2)', borderRadius: '3px', transition: 'width 0.2s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        {STEPS.map((s, i) => {
          const isActive = s === step;
          const isDone = stepIndex > i || (isActive && percent === 100);
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: isDone ? '#4ade80' : isActive ? '#8629FF' : 'rgba(255,255,255,0.2)',
                boxShadow: isActive ? '0 0 6px #8629FF' : 'none',
              }} />
              <span style={{ fontSize: '11px', color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                {i === 0 ? 'Setup' : i === 1 ? 'Video' : i === 2 ? 'Audio' : 'Merge'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'linear-gradient(160deg, #1a1040 0%, #0f0a2e 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '480px',
          width: '90%',
          color: '#fff',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Add Audio to Exported Video</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '24px', cursor: 'pointer', padding: '4px' }}>
            x
          </button>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          The video export captures visuals only. Upload your exported video here and it will be merged with the voiceover audio track — everything runs in your browser, no upload needed.
        </p>

        {state === 'idle' && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                marginBottom: '16px',
                cursor: 'pointer',
              }}
            />
            <button
              onClick={handleMerge}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #8629FF, #5B1FCC)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Merge Audio and Download
            </button>
          </>
        )}

        {state === 'processing' && (
          <div style={{ padding: '20px 0' }}>
            {progressBar}
          </div>
        )}

        {state === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              Video with audio is downloading!
            </p>
            <button
              onClick={() => { setState('idle'); setPercent(0); setStep('init'); }}
              style={{
                padding: '10px 24px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Merge Another
            </button>
          </div>
        )}

        {state === 'error' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{errorMsg}</p>
            <button
              onClick={() => { setState('idle'); setErrorMsg(''); setPercent(0); setStep('init'); }}
              style={{
                padding: '10px 24px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
