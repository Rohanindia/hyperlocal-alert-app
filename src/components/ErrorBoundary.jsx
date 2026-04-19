import React from 'react';

/**
 * ErrorBoundary - A class component that catches JavaScript errors
 * in its child component tree and displays a fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          background: '#1a1a2e',
          color: '#e0e0e0'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff6b6b' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#a0a0b0' }}>
            An unexpected error occurred. Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
