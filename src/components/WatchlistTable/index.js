import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Chip, Link, Stack } from '@mui/material';
import LaunchOutlined from '@mui/icons-material/Launch';

export default function WatchlistTable({
  items,
  isLoadingItems,
  isErrorLoading,
  isPageLoading,
}) {
  const keywordOptions = useMemo(
    () =>
      [
        ...new Set(items.flatMap((item) => item['media:keywords'].split(', '))),
      ].map((keyword) => {
        return { label: keyword, value: keyword };
      }),
    []
  );

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
          return row['media:keywords'].split(', ');
        },
        Cell: ({ renderedCellValue, row }) => (
          <Stack direction="row" spacing={0.25} useFlexGap flexWrap="wrap">
            {renderedCellValue.map((keyword) => (
              <Chip label={keyword} key={keyword} />
            ))}
          </Stack>
        ),
        minSize: 200,
        size: 400,
        maxSize: 700,
        filterSelectOptions: keywordOptions,
      },
      {
        header: 'Rating',
        id: 'mediaRating',
        accessorFn: (row) => row['media:rating']?.toUpperCase(),
        filterVariant: 'multi-select',
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: items,
    layoutMode: 'semantic',
    filterFromLeafRows: true,
    enableFacetedValues: true,
    enablePagination: false,
    enableRowVirtualization: true,
    state: {
      isLoading: isLoadingItems,
      showAlertBanner: isErrorLoading,
      showProgressBars: isPageLoading,
    },
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
    },
  });

  return <MaterialReactTable table={table} />;
}
