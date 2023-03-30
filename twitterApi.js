import config from "./config.js";

async function twitterApiCall(path) {
  const res = await fetch(new URL(path, "https://api.twitter.com"), {
    headers: {
      authorization: `Bearer ${config.bearerToken}`,
    },
  });
  const partialResponse = {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  };
  if (!res.ok) {
    const err = new Error(`Unexpected response: ${res.status}`);
    err.response = {
      ...partialResponse,
      ok: false,
      body: await res.text(),
    };
    throw err;
  }
  const body = await res.json();
  if (body.errors) {
    const err = new Error(`API response error: ${body.errors[0].title}`);
    err.response = {
      ...partialResponse,
      ok: false,
      body,
    };
    throw err;
  }
  return {
    ...partialResponse,
    ok: true,
    body,
  };
}

export async function getTweet(tweetId) {
  const res = await twitterApiCall(
    `/2/tweets/${tweetId}?tweet.fields=created_at`
  );
  return res;
}
