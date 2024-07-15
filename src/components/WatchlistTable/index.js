import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Chip, Link, Stack } from '@mui/material';
import LaunchOutlined from '@mui/icons-material/Launch';
import PropTypes from 'prop-types';

export default function WatchlistTable({
  items,
  isLoadingItems,
  isErrorLoading,
  isPageLoading,
}) {
  const rowVirtualizerInstanceRef = useRef(null);

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [sorting, setSorting] = useState([]);
  const mediaKeywords = 'media:keywords';

  //scroll to top of table when sorting or filters change
  useEffect(() => {
    try {
      if (rowVirtualizerInstanceRef.current?.getTotalSize() > 0) {
        rowVirtualizerInstanceRef.current?.scrollToIndex(0);
      }
    } catch (error) {
      console.error(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  const keywordOptions = useMemo(
    () =>
      [...new Set(items.flatMap((item) => item[mediaKeywords].split(', ')))]
        .sort()
        .map((keyword) => {
          return { label: keyword, value: keyword };
        }),
    [items]
  );

  const getKeywordsForRow = useCallback((renderedCellValue, row) => {
    if (typeof renderedCellValue === 'string') {
      return renderedCellValue.split(', ');
    }

    return row.original[mediaKeywords].split(', ');
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        Cell: ({ renderedCellValue, row }) => (
          <Link href={row.original.link} target="_blank">
            {renderedCellValue} <LaunchOutlined fontSize="x-small" />
          </Link>
        ),
        size: 250,
      },
      {
        header: 'Type',
        id: 'category',
        accessorFn: (row) => row.categories[0],
        filterVariant: 'select',
        size: 125,
      },
      {
        header: 'Summary',
        accessorKey: 'content',
        minSize: 200,
        size: 400,
        maxSize: 600,
        grow: false,
      },
      {
        header: 'Keywords',
        id: 'keywords',
        accessorFn: (row) => {
          return row[mediaKeywords].split(',');
        },
        Cell: ({ renderedCellValue, row }) => (
          <Stack direction="row" spacing={0.25} useFlexGap flexWrap="wrap">
            {getKeywordsForRow(renderedCellValue, row).map((keyword) => (
              <Chip label={keyword} key={keyword} />
            ))}
          </Stack>
        ),
        minSize: 200,
        size: 400,
        maxSize: 700,
        filterSelectOptions: keywordOptions,
        filterVariant: 'multi-select',
        filterFn: (row, columnId, filterValue) => {
          return (
            row.original[mediaKeywords]
              .split(',')
              .filter((keyword) => keyword.includes(filterValue)).length > 0
          );
        },
      },
      {
        header: 'Rating',
        id: 'mediaRating',
        accessorFn: (row) => row['media:rating']?.toUpperCase(),
        filterVariant: 'multi-select',
      },
    ],
    [keywordOptions, getKeywordsForRow]
  );

  const table = useMaterialReactTable({
    columns,
    data: items,
    layoutMode: 'semantic',
    enableFacetedValues: true,
    enablePagination: false,
    enableRowVirtualization: true,
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      isLoading: isLoadingItems,
      showProgressBars: isPageLoading,
      showAlertBanner: isErrorLoading,
      columnFilters,
      globalFilter,
      sorting,
    },
    initialState: {
      showGlobalFilter: true,
    },
  });

  return <MaterialReactTable table={table} />;
}

WatchlistTable.propTypes = {
  items: PropTypes.array.isRequired,
  isLoadingItems: PropTypes.bool.isRequired,
  isErrorLoading: PropTypes.bool.isRequired,
  isPageLoading: PropTypes.bool.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
};
