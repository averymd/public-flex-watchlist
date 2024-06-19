import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Wishlist from './components/Wishlist';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Wishlist />
    </QueryClientProvider>
  );
}
