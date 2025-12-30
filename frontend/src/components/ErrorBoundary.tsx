import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4'>
          <div className='w-full max-w-2xl bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-xl'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <div className='text-xl font-semibold text-rose-100'>
                  Something went wrong
                </div>
                <p className='text-sm text-slate-300 mt-1'>
                  We're working to fix the issue. Please try again.
                </p>
              </div>
              <button
                type='button'
                onClick={() => window.location.reload()}
                className='px-3 py-2 rounded-lg border border-rose-400 text-rose-50 bg-rose-900/50 text-sm font-semibold'
              >
                Reload
              </button>
            </div>

            <div className='mt-4 text-sm'>
              <div className='font-semibold text-slate-200'>Error details</div>
              <pre className='bg-slate-950 border border-slate-800 rounded-lg p-3 mt-2 text-slate-300 text-xs overflow-auto max-h-48 whitespace-pre-wrap'>
                {this.state.error?.toString() ?? "Unknown error"}
                {this.state.errorInfo
                  ? `\n${this.state.errorInfo.componentStack}`
                  : ""}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
