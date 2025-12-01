'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            We encountered an error while loading this content. Please try again.
          </p>
          <Button onClick={this.handleRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary for the icon grid
export function IconGridError() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Failed to load icons
      </h2>
      <p className="text-muted-foreground text-center mb-6">
        There was a problem loading the city icons. Please refresh the page.
      </p>
      <Button onClick={() => window.location.reload()} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Page
      </Button>
    </div>
  );
}

// Specialized error boundary for search
export function SearchError() {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-muted-foreground">
        Search is temporarily unavailable. Please try again later.
      </p>
    </div>
  );
}



