import type { DitherMethod, DitheredObjectOptions } from './DitheredObject';

export interface DitheredControlsProps {
  options: Required<DitheredObjectOptions>;
  onChange: (newOptions: Required<DitheredObjectOptions>) => void;
}

export function DitheredControls({ options, onChange }: DitheredControlsProps) {
  const updateOption = <K extends keyof DitheredObjectOptions>(
    key: K,
    value: DitheredObjectOptions[K]
  ) => {
    onChange({
      ...options,
      [key]: value,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        width: '320px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
        padding: '16px',
        zIndex: 99999,
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        fontSize: '11px',
        color: '#111',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '12px', letterSpacing: '0.08em', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
        ⚙ DITHERED 3D CONTROLS
      </div>

      {/* Scale */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Scale:</span> <span>{options.scale.toFixed(1)}</span>
        </label>
        <input
          type="range" min="0.5" max="15" step="0.1" value={options.scale}
          onChange={(e) => updateOption('scale', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Camera Distance */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Camera Dist:</span> <span>{options.cameraDistance.toFixed(1)}</span>
        </label>
        <input
          type="range" min="1" max="12" step="0.1" value={options.cameraDistance}
          onChange={(e) => updateOption('cameraDistance', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* FOV */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>FOV:</span> <span>{options.fov}deg</span>
        </label>
        <input
          type="range" min="30" max="110" step="1" value={options.fov}
          onChange={(e) => updateOption('fov', parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Rotation Y (Front Facing Angle) */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Rotation Y (Angle):</span> <span>{options.rotationY.toFixed(2)} rad</span>
        </label>
        <input
          type="range" min="0" max="6.28" step="0.05" value={options.rotationY}
          onChange={(e) => updateOption('rotationY', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Rotation X */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Rotation X:</span> <span>{options.rotationX.toFixed(2)} rad</span>
        </label>
        <input
          type="range" min="0" max="6.28" step="0.05" value={options.rotationX}
          onChange={(e) => updateOption('rotationX', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Rotation Z */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Rotation Z:</span> <span>{options.rotationZ.toFixed(2)} rad</span>
        </label>
        <input
          type="range" min="0" max="6.28" step="0.05" value={options.rotationZ}
          onChange={(e) => updateOption('rotationZ', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* X Offset */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>X Offset:</span> <span>{options.xOffset.toFixed(1)}</span>
        </label>
        <input
          type="range" min="-5" max="5" step="0.1" value={options.xOffset}
          onChange={(e) => updateOption('xOffset', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Y Offset */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Y Offset:</span> <span>{options.yOffset.toFixed(1)}</span>
        </label>
        <input
          type="range" min="-5" max="5" step="0.1" value={options.yOffset}
          onChange={(e) => updateOption('yOffset', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Float Intensity */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Float Intensity:</span> <span>{options.floatIntensity.toFixed(1)}</span>
        </label>
        <input
          type="range" min="0" max="4" step="0.1" value={options.floatIntensity}
          onChange={(e) => updateOption('floatIntensity', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Rotation Intensity */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Wave / Rocking:</span> <span>{options.rotationIntensity.toFixed(1)}</span>
        </label>
        <input
          type="range" min="0" max="4" step="0.1" value={options.rotationIntensity}
          onChange={(e) => updateOption('rotationIntensity', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Float Speed */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Animation Speed:</span> <span>{options.floatSpeed.toFixed(1)}</span>
        </label>
        <input
          type="range" min="0.2" max="8" step="0.2" value={options.floatSpeed}
          onChange={(e) => updateOption('floatSpeed', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Dither Method */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Dither Method:</label>
        <select
          value={options.method}
          onChange={(e) => updateOption('method', e.target.value as DitherMethod)}
          style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="halftone">Halftone</option>
          <option value="bayer">Bayer</option>
          <option value="floyd">Floyd-Steinberg</option>
        </select>
      </div>

      {/* Highlight Color */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Light Highlight:</span>
          <input
            type="color" value={options.highlight}
            onChange={(e) => updateOption('highlight', e.target.value)}
            style={{ border: 'none', width: '28px', height: '24px', cursor: 'pointer' }}
          />
        </label>
      </div>

      {/* Toggles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="checkbox" checked={options.orbit}
            onChange={(e) => updateOption('orbit', e.target.checked)}
          />
          Orbit Drag
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="checkbox" checked={options.grayscale}
            onChange={(e) => updateOption('grayscale', e.target.checked)}
          />
          Grayscale
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="checkbox" checked={options.dither}
            onChange={(e) => updateOption('dither', e.target.checked)}
          />
          Dither
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="checkbox" checked={options.invert}
            onChange={(e) => updateOption('invert', e.target.checked)}
          />
          Invert
        </label>
      </div>

    </div>
  );
}
