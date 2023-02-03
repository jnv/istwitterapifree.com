import { readFile, writeFile } from "node:fs/promises";
import config from "./config.js";
import { getTweet } from "./twitterApi.js";
import process from "node:process";

const TPL_DIR = new URL("./tpl/", import.meta.url).toString();
const OUT_DIR = new URL("./public/", import.meta.url).toString();

// https://stackoverflow.com/a/30970751/240963
function escapeHTML(s) {
  const lookup = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return s.replace(/[&"'<>]/g, (c) => lookup[c]);
}
async function generateFile(templateFilename, outputFilename, values = {}) {
  const templatePath = new URL(templateFilename, TPL_DIR);
  const outputPath = new URL(outputFilename, OUT_DIR);

  const template = await readFile(templatePath, { encoding: "utf-8" });
  let contents = template;
  for (const [key, value] of Object.entries(values)) {
    const re = new RegExp("\\${" + key + "}", "g");
    contents = contents.replace(re, escapeHTML("" + value));
  }
  await writeFile(outputPath, contents, { encoding: "utf-8" });
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
    statusShort: ok
      ? config.status.positive.short
      : config.status.negative.short,
    statusLong: ok ? config.status.positive.long : config.status.negative.long,
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
await generateFile("index.tpl.html", "index.html", tplData);
await generateFile("feed.tpl.xml", "feed.xml", tplData);

console.error(tplData);
if (!tplData.ok) {
  process.exitCode = 1;
}
