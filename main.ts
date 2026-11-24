import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "We sell naming rights to potholes: businesses sponsor the pothole outside their shop for $50 a month, and the city fills sponsored potholes first because every driver slows down to read the sign.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
}
// Bytes matter too: ties break on fewer bytes, and the gate reads UTF-8.
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes > 200) {
  throw new Error(`entry must be at most 200 bytes, got ${bytes}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
const sentences = LINE.split(".").filter((part) => part.trim().length > 0);
if (sentences.length !== 1) {
  throw new Error(`entry must be one sentence, got ${sentences.length}`);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("read-back differs from the entry");
}
