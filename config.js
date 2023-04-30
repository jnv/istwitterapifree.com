import { toISODate } from "./utils.js";

const tweetId = "1641222786894135296";
const startDate = new Date("2023-03-29T23:36:18.000Z"); // created_at of the tweet
const finalDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 days

const explanationLink = `https://twitter.com/TwitterDev/status/${tweetId}`;

function getDaysDiff(start, end) {
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / (1000 * 3600 * 24));
}

const addtlDetails = {
  11: "But to be clear, Twitter appreciates your investment in their platform and hopes to continue your relationship with them. (source: <a href='https://twittercommunity.com/t/reminder-to-migrate-to-the-new-free-basic-or-enterprise-plans-of-the-twitter-api/189737'>https://twittercommunity.com/t/reminder-to-migrate-to-the-new-free-basic-or-enterprise-plans-of-the-twitter-api/189737</a>).",
  12: "Technically, there'll still be a free access tier for useful bots like me.",
  15: "#APIcalypse is coming…",
  17: "Have you “upgraded” already?",
  23: `Premium API has been deprecated. <a href="https://twitter.com/TwitterDev/status/1649191520250245121">https://twitter.com/TwitterDev/status/1649191520250245121</a>`,
};

export default {
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
  tweetId: process.env.TWEET_ID || tweetId,
  getEntryLink({ ok, now }) {
    const daysSince = getDaysDiff(startDate, now);
    return `https://istwitterapifree.com/?s=${daysSince}_${tweetId}_${ok}`;
  },
  getStatusStrings({ now, ok }) {
    const diffMs = finalDate.getTime() - now.getTime();
    const diffDays = getDaysDiff(now, finalDate);
    const daysSince = getDaysDiff(startDate, now);

    const rtf = new Intl.RelativeTimeFormat("en", {
      localeMatcher: "best fit", // other values: "lookup"
      numeric: "auto", // other values: "auto"
      style: "short", // other values: "short" or "narrow"
    });
    const daysRelative = rtf.format(diffDays, "days");
    if (ok) {
      if (diffDays >= 0) {
        const overNext =
          diffDays === 0 ? "today" : `over the next ${diffDays} days`;
        return {
          statusShort: "Technically yes",
          statusLong: "Technically yes.",
          explanation: `Legacy access still works for some apps. These <a href="${explanationLink}">will be forced to migrate ${overNext}</a>.`,
          addtlRss: addtlDetails[daysSince] ?? "",
        };
      } else {
        return {
          statusShort: "Yes, still",
          statusLong: "Legacy access to Twitter API still seems to work.",
          explanation: `Current free access tiers <a href="${explanationLink}">were supposed to be deprecated ${daysRelative}</a>. #WorksForMe`,
          addtlRss: "", 
        };
      }
    } else {
      // not ok
      if (diffMs > 0) {
        return {
          statusShort: "No?",
          statusLong: "Maybe? Twitter API responds with error.",
          explanation: `Likely it's down, or the <a href="${explanationLink}">free access tiers were already deprecated</a>.`,
          addtlRss: "", 
        };
      } else {
        return {
          statusShort: "No",
          statusLong:
            "No, Twitter API isn't available for free anymore (except for limited posting).",
          explanation: `Time to <a href="https://developer.twitter.com/en">pay up</a>. Or just move somewhere else.`,
          addtlRss: "", 
        };
      }
    }
  },
};
