import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const SimpleToast: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'info': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '•';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '250px',
        maxWidth: '350px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
      }}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{getIcon()}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0',
          marginLeft: '8px',
        }}
      >
        ×
      </button>
    </div>
  );
};

// Toast manager
let toastId = 0;
const toasts: { [key: number]: ToastProps } = {};

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) => {
  const id = toastId++;
  toasts[id] = { message, type, duration, onClose: () => removeToast(id) };
  
  // Force React update
  if (window.toastUpdateCallback) {
    window.toastUpdateCallback();
  }
  
  // Direct DOM manipulation as backup
  const toastElement = document.createElement('div');
  toastElement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 10000;
    min-width: 250px;
    max-width: 350px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toastElement.innerHTML = `
    <span style="font-size: 16px; font-weight: bold;">${icon}</span>
    <span style="flex: 1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; margin-left: 8px;">×</button>
  `;
  
  document.body.appendChild(toastElement);
  
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement);
    }
  }, duration || 4000);
};

const removeToast = (id: number) => {
  delete toasts[id];
  if (window.toastUpdateCallback) {
    window.toastUpdateCallback();
  }
};

// Toast container component
export const ToastContainer: React.FC = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    window.toastUpdateCallback = () => forceUpdate({});
    return () => {
      delete window.toastUpdateCallback;
    };
  }, []);

  return (
    <>
      {Object.entries(toasts).map(([id, toast]) => (
        <SimpleToast
          key={id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={toast.onClose}
        />
      ))}
    </>
  );
};

// Add to window object for TypeScript
declare global {
  interface Window {
    toastUpdateCallback?: () => void;
  }
} 