import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPlexWatchlistFeed } from '../../api/plexApi';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import React from 'react';
import WatchlistTable from '../WatchlistTable';

export default function Watchlist() {
  const {
    data,
    isPending,
    isLoading,
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
    refetchOnWindowFocus: false,
  });

  let loadMoreItems = useCallback(
    (containerRefElement) => {
      // if (containerRefElement) {
      // const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
      //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can

      if (
        // scrollHeight - scrollTop - clientHeight < 400 &&
        !isFetching &&
        hasNextPage
      ) {
        fetchNextPage();
      }
      // }
    },
    [fetchNextPage, isFetching, hasNextPage]
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMoreItems();
    }
  }, [loadMoreItems, hasNextPage, isFetchingNextPage, data]);

  const flatItems = useMemo(
    () => data?.pages?.flatMap((row) => row.items) ?? [],
    [data]
  );

  return (
    <>
      {!isPending && (
        <WatchlistTable
          items={flatItems}
          isLoadingItems={isLoading}
          isErrorLoading={isLoadingError}
          isPageLoading={isFetchingNextPage}
          loadMoreItems={loadMoreItems}
        />
      )}
    </>
  );
}
