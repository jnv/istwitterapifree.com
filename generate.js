import { readFile, writeFile } from "node:fs/promises";
import config from "./config.js";
import { getTweet } from "./twitterApi.js";
import process from "node:process";

const TPL_DIR = new URL("./tpl/", import.meta.url).toString();
const OUT_DIR = new URL("./public/", import.meta.url).toString();

const INDEX_TEMPLATE = new URL("./index.tpl.html", TPL_DIR);
const INDEX_OUT = new URL("./index.html", OUT_DIR);

async function generateFile(templateFile, outputFile, values = {}) {
  const template = await readFile(templateFile, { encoding: "utf-8" });
  let contents = template;
  for (const [key, value] of Object.entries(values)) {
    const re = new RegExp("\\${" + key + "}", "g");
    contents = contents.replace(re, value);
  }
  await writeFile(outputFile, contents, { encoding: "utf-8" });
}

async function getApiResponse() {
  let response;
  let ok = true;
  try {
    response = await getTweet(config.tweetId);
  } catch (err) {
    response = err.response;
    ok = response?.ok || false;
  }

  return { ok, response };
}

function formatResponse(response) {
  const headers = [...response.headers.entries()]
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const body =
    typeof response.body === "string"
      ? response.body
      : JSON.stringify(response.body, null, 2);
  return `${response.status} ${response.statusText}
${headers}

${body}`;
}

async function getTemplateData() {
  const { ok, response } = await getApiResponse();
  const now = new Date();
  const tplData = {
    ok,
    status: ok ? "Yes" : "Probably yes", // FIXME after Feb 8
    generatedHuman: now.toLocaleString("en-GB", {
      timeZone: "UTC",
      dateStyle: "long",
      timeStyle: "long",
    }),
    generatedDatetime: now.toISOString(),
    response: formatResponse(response),
  };
  return tplData;
}

// console.log({ TPL_DIR, OUT_DIR, INDEX_OUT, INDEX_TEMPLATE });
const tplData = await getTemplateData();
await generateFile(INDEX_TEMPLATE, INDEX_OUT, tplData);
console.error(tplData);
if (!tplData.ok) {
  process.exitCode = 1;
}
