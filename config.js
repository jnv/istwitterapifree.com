export default {
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
  // tweetId: "20",
  tweetId: process.env.TWEET_ID || "1621026986784337922",
  status: {
    positive: {
      short: "Yes",
      long: "Yes, Twitter API is free.",
    },
    negative: {
      // FIXME after Feb 8
      short: "Not sure",
      long: "Twitter API should still be free, but something's happening",
    },
  },
};
