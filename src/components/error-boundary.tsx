import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by error boundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-danger">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-default-600 mb-6 text-center max-w-md">
            We're sorry, but an error occurred while loading this page.
          </p>
          <div className="flex gap-4">
            <Button
              color="primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
            <Button
              as={Link}
              href="/"
              variant="flat"
            >
              Return to Home
            </Button>
          </div>
          {this.state.error && (
            <div className="mt-8 p-4 bg-default-100 rounded-lg max-w-md overflow-auto text-sm">
              <p className="font-semibold mb-2">Error details:</p>
              <p className="text-danger">{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
