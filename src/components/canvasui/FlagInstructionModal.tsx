import { useState, useEffect, useSyncExternalStore } from 'react';
import { supportsHtmlInCanvas } from './Cloth';

// Simple subscription that never updates, as the support is static per session
const emptySubscribe = () => () => {};

export function FlagInstructionModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isHtmlInCanvasSupported = useSyncExternalStore(
    emptySubscribe,
    supportsHtmlInCanvas,
    () => false
  );

  useEffect(() => {
    // Only show if the feature is NOT supported
    if (isHtmlInCanvasSupported) return;

    // Check if the user is on a Chromium-based browser (Chrome, Edge, Opera, Brave)
    // Non-Chromium browsers (Safari, Firefox) don't have this flag, so we shouldn't prompt them.
    const isChromium = 
      //@ts-expect-error chrome is a non-standard property
      typeof window !== 'undefined' && !!window.chrome;

    if (!isChromium) return;

    // Check if the user has already dismissed the modal in this session
    const hasDismissed = sessionStorage.getItem('flag_modal_dismissed');
    if (!hasDismissed) {
      // Add a small delay for a smoother entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isHtmlInCanvasSupported]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    sessionStorage.setItem('flag_modal_dismissed', 'true');
    setIsVisible(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('chrome://flags/#enable-experimental-web-platform-features');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '480px',
          background: 'rgba(20, 20, 20, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '32px',
          color: '#FAF9F6',
          fontFamily: 'var(--font-sans)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f0e6d2' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
            Nâng cấp trải nghiệm hình ảnh
          </h2>
        </div>

        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '24px' }}>
          Trang web này có sử dụng hiệu ứng tương tác vật lý 3D nguyên bản. Để xem được hiệu ứng tốt nhất trên trình duyệt của bạn, vui lòng bật tính năng ẩn theo hướng dẫn sau:
        </p>

        <ol style={{ paddingLeft: '20px', margin: '0 0 24px 0', fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.9 }}>
          <li style={{ paddingLeft: '8px', marginBottom: '8px' }}>Mở thẻ mới và dán đường link bên dưới.</li>
          <li style={{ paddingLeft: '8px', marginBottom: '8px' }}>
            Chuyển trạng thái sang <strong style={{ color: '#fff', fontWeight: 500 }}>Enabled</strong>.
          </li>
          <li style={{ paddingLeft: '8px' }}>
            Bấm <strong style={{ color: '#fff', fontWeight: 500 }}>Relaunch</strong> (Khởi động lại).
          </li>
        </ol>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '32px',
          }}
        >
          <code style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', opacity: 0.7, wordBreak: 'break-all' }}>
            chrome://flags/#enable-experimental-web-platform-features
          </code>
          <button
            onClick={handleCopy}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginLeft: '12px',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          >
            {isCopied ? 'Đã copy ✓' : 'Copy link'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Tiếp tục với giao diện tiêu chuẩn
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
