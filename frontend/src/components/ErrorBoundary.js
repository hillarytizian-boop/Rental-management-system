import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black/80 text-white p-6">
          <div className="glass p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-red-400 mb-4">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="neon-btn">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
