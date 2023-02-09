const finalDate = new Date(1676246400 * 1000); // Feb 13 midnight UTC

export default {
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
  // tweetId: "20",
  tweetId: process.env.TWEET_ID || "1623467615539859456",
  status: {
    positive: {
      short: "Yes",
      long: "Yes, Twitter API is free.",
    },
    negative: {
      short: "Not sure",
      long: "Twitter API should still be free, but something's happening",
    },
  },
  getStatusStrings({ now, ok }) {
    const diffMs = finalDate.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 3600 * 24));
    // const diffHours = diffMs / (1000 * 3600);

    const rtf = new Intl.RelativeTimeFormat("en", {
      localeMatcher: "best fit", // other values: "lookup"
      numeric: "auto", // other values: "auto"
      style: "long", // other values: "short" or "narrow"
    });
    const daysRelative = rtf.format(diffDays, "days");

    if (diffMs <= 0) {
      if (ok) {
        return {
          statusShort: "Yes",
          statusLong: "Yes, Twitter API seems to be still available for free.",
          explanation: `<a href="https://twitter.com/TwitterDev/status/1623467615539859456">The extendes deadline was ${daysRelative}</a>.`,
        };
      } else {
        return {
          statusShort: "No",
          statusLong:
            "No, looks like Twitter API isn't available for free anymore.",
          explanation: ``,
        };
      }
    }

    if (ok) {
      return {
        statusShort: "Yes",
        statusLong: "Yes, Twitter API is free.",
        explanation: `<a href="https://twitter.com/TwitterDev/status/1623467615539859456">The extended deadline is ${daysRelative}</a>.`,
      };
    } else {
      return {
        statusShort: "Probably",
        statusLong:
          "Twitter API should still be free, but something's happening",
        explanation: `<a href="https://twitter.com/TwitterDev/status/1623467615539859456">The extended deadline is ${daysRelative}</a>.`,
      };
    }
  },
};
