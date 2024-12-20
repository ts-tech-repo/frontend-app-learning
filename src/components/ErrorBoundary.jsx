import React from "react";

class SecondLevelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Custom logic to filter errors, only handle a specific set of errors
    // if (error.message && error.message.includes("SpecificError")) {
      return { hasError: true, error };
    // }
    // return null; // Pass the error up to the parent error boundary
  }

  componentDidCatch(error, info) {
    console.log("Second Level ErrorBoundary caught an error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Oops! A specific error occurred. Please try again later.</h2>;
    }

    return this.props.children;
  }
}

export { SecondLevelErrorBoundary };
