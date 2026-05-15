import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unexpected runtime error' };
  }

  componentDidCatch(error, errorInfo) {
    // Keep this log for browser debugging when users report blank screens.
    console.error('LMS runtime crash:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('theme');
    } catch {
      // Ignore storage failures.
    }
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', fontFamily: 'Inter, sans-serif', background: '#f4f7ff' }}>
          <div style={{ maxWidth: '640px', width: '100%', background: '#fff', border: '1px solid #c7d2fe', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 28px rgba(15,23,42,0.12)' }}>
            <h1 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>App recovered from a runtime error</h1>
            <p style={{ marginTop: '10px', color: '#475569' }}>
              We prevented a blank screen. Please reset local data and reload.
            </p>
            <pre style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', background: '#f8fafc', color: '#334155', overflowX: 'auto' }}>
              {this.state.message}
            </pre>
            <button
              type="button"
              onClick={this.handleReset}
              style={{ marginTop: '14px', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', border: 'none', color: '#fff', fontWeight: 600, borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' }}
            >
              Reset local data and reopen login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
