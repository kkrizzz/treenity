import React, { useEffect } from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children.props?.id !== this.props.children?.props?.id) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { error } = this.state;
    useEffect(() => {
      if (error) console.error('ErrorBoundary', error);
    }, [error]);
    if (error) {
      // You can render any custom fallback UI
      return <pre className="card error">{error.stack}</pre>;
    }

    return this.props.children;
  }
}
