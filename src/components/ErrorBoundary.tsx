import { Result } from 'antd';
import { Component, type ReactNode } from 'react';
import { KlButton } from './base';
import { ROUTES } from '@/constants';

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class Boundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary caught]:', error, info);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Result
            status='error'
            title='Have an Error'
            subTitle={this.state.error?.message || 'Unknown Error'}
            extra={
              <>
                <KlButton onClick={this.handleRetry}>Retry</KlButton>

                <KlButton
                  type='primary'
                  onClick={() => {
                    window.location.href = ROUTES.DASHBOARD;
                  }}
                >
                  Back to Dashboard
                </KlButton>
              </>
            }
          />
        )
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = Boundary;
