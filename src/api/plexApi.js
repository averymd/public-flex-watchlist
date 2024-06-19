import axios from 'axios';
import Parser from 'rss-parser';

export async function fetchPlexWatchlistFeed(feed) {
  let rssParser = new Parser();
  return rssParser.parseURL(feed);
}
