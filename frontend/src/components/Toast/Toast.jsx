import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

const toastContainerId = 'toast-container';

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div id={toastContainerId} className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

const Toast = ({ id, type = 'info', title, message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  const colors = {
    success: 'var(--success)',
    error: 'var(--error)',
    warning: 'var(--warning)',
    info: 'var(--accent)',
  };

  if (!visible && exiting) return null;

  return (
    <div
      className={`toast toast-${type} ${exiting ? 'exiting' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="toast-icon" style={{ color: colors[type] }}>
        {icons[type]}
      </div>
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        {message && <div className="toast-message">{message}</div>}
      </div>
      <button
        className="toast-close"
        onClick={() => {
          setExiting(true);
          setTimeout(onClose, 200);
        }}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="toast-progress" style={{ backgroundColor: colors[type] }} />
    </div>
  );
};

export default ToastContainer;

let toastId = 0;
const listeners = [];

const notify = (options) => {
  const id = ++toastId;
  const toast = { id, ...options };
  listeners.forEach((listener) => listener((prev) => [...prev, toast]));
  return id;
};

export const toast = {
  success: (title, message, duration) => notify({ type: 'success', title, message, duration }),
  error: (title, message, duration) => notify({ type: 'error', title, message, duration }),
  warning: (title, message, duration) => notify({ type: 'warning', title, message, duration }),
  info: (title, message, duration) => notify({ type: 'info', title, message, duration }),
  remove: (id) => {
    listeners.forEach((listener) => listener((prev) => prev.filter((t) => t.id !== id)));
  },
  subscribe: (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },
};

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  return <ToastContainer toasts={toasts} onRemove={toast.remove} />;
};