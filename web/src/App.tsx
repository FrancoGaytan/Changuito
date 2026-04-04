import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { FeedbackProvider } from './context/FeedbackContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 20,        // datos obsoletos a los 20s → dispara refetch en focus
      refetchOnWindowFocus: true,   // refetch cuando el usuario vuelve a la tab/app
      refetchOnReconnect: true,     // refetch al recuperar conexión
      refetchOnMount: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FeedbackProvider>
        <RouterProvider router={router} />
      </FeedbackProvider>
    </QueryClientProvider>
  );
}

export default App;
