import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPlexWatchlistFeed } from '../../api/plexApi';
import { useState } from 'react';

export default function Wishlist() {
  const [feedItems, setFeedItems] = useState([]);
  const [currentFeedUrl, setCurrentFeedUrl] = useState(
    process.env.BASE_RSS_FEED
  );

  const { isPending, isError, data, error, isFetching, isSuccess } = useQuery({
    queryKey: ['wishlistItems', currentFeedUrl],
    queryFn: () => fetchPlexWatchlistFeed(currentFeedUrl),
  });

  return (
    <div>
      <div>{isFetching ? 'Updating...' : ''}</div>
      <div>{isSuccess ? data.title : 'nothing'}</div>
    </div>
  );
}
