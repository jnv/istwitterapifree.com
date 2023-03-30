import { toISODate } from "./utils.js";

const tweetId = "1641222786894135296";
const startDate = new Date("2023-03-29T23:36:18.000Z"); // created_at of the tweet
const finalDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 days

const explanationLink = `https://twitter.com/TwitterDev/status/${tweetId}`;

export default {
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
  tweetId: process.env.TWEET_ID || tweetId,
  getEntryLink({ ok, now }) {
    return `https://istwitterapifree.com/?s=${toISODate(now)}_${tweetId}_${ok}`;
  },
  getStatusStrings({ now, ok }) {
    const diffMs = finalDate.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 3600 * 24));
    // const diffHours = diffMs / (1000 * 3600);

    const rtf = new Intl.RelativeTimeFormat("en", {
      localeMatcher: "best fit", // other values: "lookup"
      numeric: "auto", // other values: "auto"
      style: "short", // other values: "short" or "narrow"
    });
    const daysRelative = rtf.format(diffDays, "days");
    if (ok) {
      if (diffMs > 0) {
        return {
          statusShort: "Yes",
          statusLong: "Yes, Twitter API is still available for free.",
          explanation: `Current free access tiers <a href="${explanationLink}">will be deprecated</a> ${daysRelative}.`,
        };
      } else {
        return {
          statusShort: "Yes",
          statusLong: "Yes, Twitter API is still available for free.",
          explanation: `Current free access tiers <a href="${explanationLink}">were supposed to be deprecated</a> ${daysRelative}.`,
        };
      }
    } else {
      // not ok
      if (diffMs > 0) {
        return {
          statusShort: "Probably",
          statusLong: "Maybe? Twitter API responds with error.",
          explanation: `Likely it's down, or the <a href="${explanationLink}">free access tiers were deprecated sooner</a> than ${daysRelative}.`,
        };
      } else {
        return {
          statusShort: "No",
          statusLong:
            "No, Twitter API isn't available for free anymore (except for limited posting).",
          explanation: `Time to <a href="https://developer.twitter.com/en">pay up</a>. Or just move somewhere else.`,
        };
      }
    }
  },
};
