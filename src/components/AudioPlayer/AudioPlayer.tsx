import { useState, useRef, useEffect } from 'react';
import { assetPath } from '../../lib/assetPath';

export function AudioPlayer() {
  // Default sound: ON
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;

    // Attempt autoplay on mount or first user gesture
    const startPlay = () => {
      if (!audioRef.current) return;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Browser blocked un-prompted autoplay; will play on first click/scroll
      });
    };

    startPlay();

    // Trigger on first click or scroll if browser blocked initial autoplay
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('wheel', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('wheel', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('wheel', handleFirstInteraction);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0.4;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlaying(true);
      });
    }
  };

  return (
    <div
      className="audio-player-widget"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '32px',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      <audio
        ref={audioRef}
        src={assetPath('assets/interstellar.mp3')}
        preload="auto"
        loop
      />

      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Pause Theme Audio' : 'Play Theme Audio'}
        className={`audio-toggle-btn ${isPlaying ? 'is-playing' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '8px 14px',
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: '11px',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Equalizer animation icon */}
        <span className="audio-eq-icon" style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
          <span className="eq-bar bar-1" style={{ width: '2px', height: isPlaying ? '12px' : '4px', backgroundColor: 'currentColor', transition: 'height 0.3s' }} />
          <span className="eq-bar bar-2" style={{ width: '2px', height: isPlaying ? '8px' : '6px', backgroundColor: 'currentColor', transition: 'height 0.3s' }} />
          <span className="eq-bar bar-3" style={{ width: '2px', height: isPlaying ? '10px' : '3px', backgroundColor: 'currentColor', transition: 'height 0.3s' }} />
        </span>

        <span>{isPlaying ? 'SOUND: ON' : 'SOUND: OFF'}</span>
      </button>
    </div>
  );
}
