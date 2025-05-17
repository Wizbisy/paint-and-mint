"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    console.error("ErrorBoundary caught error:", error);
    return { error: error.message };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback || (
        <div style={{ color: "red", padding: "20px" }}>
          <h2>Application Error</h2>
          <p>{this.state.error}</p>
          <p>Check the console for more details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
