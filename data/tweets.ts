/**
 * Tweet URLs for the homepage TweetGrid.
 * getTweetId extracts the status id from a Twitter/X URL.
 */

export const tweets: string[] = [
  "https://twitter.com/a2base/status/1",
  "https://twitter.com/a2base/status/2",
  "https://twitter.com/a2base/status/3",
];

export function getTweetId(tweetUrl: string): string {
  const match = tweetUrl.match(/status\/(\d+)/);
  return match ? match[1] : tweetUrl;
}
