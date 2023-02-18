const finalDate = new Date(1676678170852); // 2023-02-17T23:56:10.852Z

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

    if (diffMs < 0) {
      if (ok) {
        return {
          statusShort: "Yes",
          statusLong: "Yes, Twitter API is still available for free.",
          explanation: `Roll out planned <a href="https://twitter.com/TwitterDev/status/1626732269174943745">“over the next few weeks”</a> (since ${daysRelative}).`,
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
