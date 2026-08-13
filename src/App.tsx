import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy, memo } from 'react';
import { queryClient } from './lib';
import { ConfigProvider, ErrorBoundary } from '@/components';

const AppRouter = lazy(() => import('@/routes/AppRouter'));
const Message = lazy(() => import('@/components/Message'));

const App = memo(function App() {
  return (
    <ConfigProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
          <Suspense fallback={null}>
            <Message />
          </Suspense>
        </QueryClientProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
});

export default App;
