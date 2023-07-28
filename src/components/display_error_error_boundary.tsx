import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    errorMsg: string
}

class DisplayErrorErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        errorMsg: '',
    }

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        console.log('getDerivedStateFromError')
        return { hasError: true, errorMsg: error.message }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log('componentDidCatch')
        console.error('Uncaught error:', error, errorInfo)
    }

    public render(): any {
        if (this.state.hasError) {
            return <h1>Sorry.. there was an error: {this.state.errorMsg} </h1>
        }
        return this.props.children
    }
}

export default DisplayErrorErrorBoundary
