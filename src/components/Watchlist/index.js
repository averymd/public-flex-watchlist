import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPlexWatchlistFeed } from '../../api/plexApi';
import { useEffect, useMemo } from 'react';
import React from 'react';
import WatchlistTable from '../WatchlistTable';

export default function Watchlist() {
  const {
    data,
    isPending,
    isLoadingError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['watchlistItems'],
    queryFn: fetchPlexWatchlistFeed,
    initialPageParam: process.env.BASE_RSS_FEED,
    getNextPageParam: (lastPage) => lastPage?.paginationLinks?.next,
  });

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const justItems = useMemo(
    () => data?.pages?.flatMap((row) => row.items) ?? [],
    [data]
  );

  return (
    <>
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
