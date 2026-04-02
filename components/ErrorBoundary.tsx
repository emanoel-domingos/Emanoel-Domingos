import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    (this as any).state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { children } = (this as any).props;
    
    if ((this as any).state.hasError) {
      let errorMessage = "Ocorreu um erro inesperado.";
      try {
        const errorMsg = (this as any).state.error?.message || "";
        if (errorMsg.startsWith('{')) {
          const parsedError = JSON.parse(errorMsg);
          if (parsedError.error && parsedError.error.includes("insufficient permissions")) {
            errorMessage = "Você não tem permissão para realizar esta ação.";
          }
        }
      } catch (e) {
        // Not a JSON error message
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-brand-red" />
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-dark">Ops! Algo deu errado</h2>
            <p className="text-gray-600 leading-relaxed">
              {errorMessage}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Recarregar Página
            </Button>
          </div>
        </div>
      );
    }

    return children;
  }
}
