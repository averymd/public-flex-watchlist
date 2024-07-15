import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Watchlist from './components/Watchlist';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Watchlist />
    </QueryClientProvider>
  );
}
