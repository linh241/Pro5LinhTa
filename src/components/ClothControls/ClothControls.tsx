import { useState } from 'react';

export interface ClothConfig {
  wind: number;
  speed: number;
  amplitude: number;
  drape: number;
  brush: number;
  brushSize: number;
  damping: number;
  light: number;
  sheen: number;
  shadow: number;
  perspective: number;
  pin: 'top' | 'bottom' | 'left' | 'right';
}

interface ClothControlsProps {
  config: ClothConfig;
  onChange: (newConfig: ClothConfig) => void;
}

export function ClothControls({ config, onChange }: ClothControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateProp = (key: keyof ClothConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div
      className="cloth-controls-widget"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: 'rgba(20, 20, 20, 0.85)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '8px 14px',
          borderRadius: '20px',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          letterSpacing: '0.05em',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <span>⚙ CLOTH CONTROLS</span>
        <span>{isOpen ? '✕' : '▲'}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '44px',
            right: 0,
            width: '280px',
            maxHeight: '420px',
            overflowY: 'auto',
            backgroundColor: 'rgba(18, 18, 18, 0.92)',
            color: '#e0e0e0',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '16px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', fontWeight: 'bold' }}>
            <span>CLOTH PARAMETERS</span>
            <button
              onClick={() =>
                onChange({
                  wind: 2.5,
                  speed: 0.4,
                  amplitude: 25,
                  drape: 30,
                  brush: 1.8,
                  brushSize: 180,
                  damping: 1.2,
                  light: 0.4,
                  sheen: 0.08,
                  shadow: 0.15,
                  perspective: 1500,
                  pin: 'top',
                })
              }
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '10px' }}
            >
              RESET
            </button>
          </div>

          {/* Wind */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Wind</span>
              <span>{config.wind}</span>
            </div>
            <input type="range" min="0" max="10" step="0.1" value={config.wind} onChange={(e) => updateProp('wind', parseFloat(e.target.value))} />
          </div>

          {/* Speed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Speed</span>
              <span>{config.speed}</span>
            </div>
            <input type="range" min="0.1" max="2" step="0.05" value={config.speed} onChange={(e) => updateProp('speed', parseFloat(e.target.value))} />
          </div>

          {/* Amplitude */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Amplitude</span>
              <span>{config.amplitude}</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={config.amplitude} onChange={(e) => updateProp('amplitude', parseFloat(e.target.value))} />
          </div>

          {/* Drape */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Drape</span>
              <span>{config.drape}</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={config.drape} onChange={(e) => updateProp('drape', parseFloat(e.target.value))} />
          </div>

          {/* Brush */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Brush Strength</span>
              <span>{config.brush}</span>
            </div>
            <input type="range" min="0" max="5" step="0.1" value={config.brush} onChange={(e) => updateProp('brush', parseFloat(e.target.value))} />
          </div>

          {/* Brush Size */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Brush Size</span>
              <span>{config.brushSize}px</span>
            </div>
            <input type="range" min="50" max="400" step="10" value={config.brushSize} onChange={(e) => updateProp('brushSize', parseInt(e.target.value))} />
          </div>

          {/* Damping */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Damping</span>
              <span>{config.damping}</span>
            </div>
            <input type="range" min="0.1" max="5" step="0.1" value={config.damping} onChange={(e) => updateProp('damping', parseFloat(e.target.value))} />
          </div>

          {/* Light */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Light</span>
              <span>{config.light}</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={config.light} onChange={(e) => updateProp('light', parseFloat(e.target.value))} />
          </div>

          {/* Sheen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Sheen</span>
              <span>{config.sheen}</span>
            </div>
            <input type="range" min="0" max="1" step="0.02" value={config.sheen} onChange={(e) => updateProp('sheen', parseFloat(e.target.value))} />
          </div>

          {/* Shadow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shadow</span>
              <span>{config.shadow}</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={config.shadow} onChange={(e) => updateProp('shadow', parseFloat(e.target.value))} />
          </div>

          {/* Perspective */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Perspective</span>
              <span>{config.perspective}</span>
            </div>
            <input type="range" min="400" max="3000" step="50" value={config.perspective} onChange={(e) => updateProp('perspective', parseInt(e.target.value))} />
          </div>

          {/* Pin */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pin Edge</span>
              <select value={config.pin} onChange={(e) => updateProp('pin', e.target.value as any)} style={{ background: '#333', color: '#fff', border: 'none', padding: '2px 4px', borderRadius: '4px' }}>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
