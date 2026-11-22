// gta6-clipper-01 entry (Node 22, standard library only).
//
// The entry itself is the YouTube video: this program only hands the house
// the address of that video. It copies VIDEO.json from the repository root
// into the output directory, where the gate reads it. Nothing else is
// written, and nothing about the video is computed here — the house reads
// the video's views straight from YouTube.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The grader mounts the repository at /bot and collects output at /output.
// The two environment variables let the same program run outside the
// grader, with the repository directory standing in for /bot.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, "VIDEO.json");
const target = join(outputDir, "VIDEO.json");

try {
  copyFileSync(source, target);
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`Could not copy VIDEO.json from ${botDir}: ${reason}`);
  process.exit(1);
}

// Fail fast rather than hand the gate a broken file: the copied VIDEO.json
// must parse and carry the video's address as a string.
try {
  const parsed: unknown = JSON.parse(readFileSync(target, "utf8"));
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { url?: unknown }).url !== "string"
  ) {
    throw new Error("VIDEO.json has no string url field");
  }
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`VIDEO.json is not usable: ${reason}`);
  process.exit(1);
}
