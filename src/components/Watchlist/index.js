import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchPlexWatchlistFeed } from '../../api/plexApi';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import WatchlistTable from '../WatchlistTable';

export default function Watchlist() {
  const {
    data,
    error,
    isPending,
    isLoadingError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['watchlistItems'],
    queryFn: fetchPlexWatchlistFeed,
    initialPageParam: process.env.BASE_RSS_FEED,
    getNextPageParam: (lastPage, pages) => lastPage?.paginationLinks?.next,
  });

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching]);

  const justItems = useMemo(
    () => data?.pages?.flatMap((row) => row.items) ?? [],
    [data]
  );

  return (
    <>
      <h1>Plex Watchlist</h1>
      {!isPending && (
        <WatchlistTable
          items={justItems}
          isLoadingItems={isFetching}
          isErrorLoading={isLoadingError}
          isPageLoading={isFetchingNextPage}
        />
      )}
    </>
  );
}
