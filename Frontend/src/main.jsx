import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function BootLoader() {
  const [AppComponent, setAppComponent] = useState(null);
  const [bootError, setBootError] = useState(null);

  useEffect(() => {
    let active = true;

    import('./App.jsx')
      .then((mod) => {
        if (active) {
          setAppComponent(() => mod.default);
        }
      })
      .catch((error) => {
        if (active) {
          console.error('App bootstrap failed:', error);
          setBootError(error);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (bootError) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', fontFamily: 'Inter, sans-serif', background: '#f8fafc' }}>
        <div style={{ maxWidth: '720px', width: '100%', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '20px', background: '#ffffff' }}>
          <h1 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>Startup error detected</h1>
          <p style={{ marginTop: '8px', color: '#475569' }}>
            The app failed during initial load. Open browser DevTools console and share this error text.
          </p>
          <pre style={{ marginTop: '12px', background: '#f8fafc', borderRadius: '10px', padding: '12px', overflowX: 'auto', color: '#334155' }}>
            {bootError?.stack || bootError?.message || String(bootError)}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ marginTop: '14px', border: 'none', borderRadius: '10px', padding: '10px 14px', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
          >
            Reload app
          </button>
        </div>
      </div>
    );
  }

  if (!AppComponent) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'Inter, sans-serif', color: '#475569' }}>
        Loading Tecnoprism LMS...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AppComponent />
    </ErrorBoundary>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BootLoader />
  </StrictMode>,
);
