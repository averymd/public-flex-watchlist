import axios from 'axios';
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
  let result = rssParser.parseURL(pageParam);
  return result;
}
