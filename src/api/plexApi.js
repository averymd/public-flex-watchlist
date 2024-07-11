import Parser from 'rss-parser';

export async function fetchPlexWatchlistFeed({ pageParam }) {
  let rssParser = new Parser({
    customFields: {
      item: [
        'media:credit',
        'media:thumbnail',
        'media:keywords',
        'media:rating',
      ],
    },
  });
  return rssParser.parseURL(pageParam);
}
