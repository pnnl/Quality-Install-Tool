import React, { ErrorInfo, ReactNode, useEffect, useState } from "react";
import {useErrorBoundary} from "react-use-error-boundary";
type ErrorBoundaryProps = {
    children: ReactNode;
}

function ErrorBoundary({ children }: ErrorBoundaryProps) {
    const [hasError, setHasError] = useState(false);
    const [error, resetError] = useErrorBoundary();
    console.log("Error boundary")   
    useEffect(() => {
        resetError();
    }, [children]);

    const componentDidCatch = (error: Error, errorInfo: ErrorInfo) => {
        console.log(error,errorInfo);
        setHasError(true);
    }

    if (error) {
        console.log("error detected in error boundary")
        return <div>Something went wrong.</div>
    }
    return <>{children}</>;
}

export default ErrorBoundary;