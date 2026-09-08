// On Windows without Developer Mode, fs.symlinkSync defaults to file symlinks,
// which require elevation. Package links are directories, so "junction" works
// without elevation. OpenNext's copyTracedFiles doesn't pass a type — patch it
// for the duration of the machine (idempotent, re-applied on every cf:build).
import { readFileSync, writeFileSync } from "node:fs";

const file = "node_modules/@opennextjs/aws/dist/build/copyTracedFiles.js";
const target = "symlinkSync(symlink, to);";
const replacement = 'symlinkSync(path.resolve(path.dirname(to), symlink), to, "junction");';

let text;
try {
  text = readFileSync(file, "utf8");
} catch {
  console.log("[patch-opennext-win] file not found, skipping:", file);
  process.exit(0);
}

if (text.includes('symlinkSync(path.resolve(path.dirname(to), symlink), to, "junction");')) {
  console.log("[patch-opennext-win] already patched");
  process.exit(0);
}

if (!text.includes(target)) {
  console.log("[patch-opennext-win] pattern not found, skipping");
  process.exit(0);
}

text = text.replace(target, replacement);
writeFileSync(file, text);
console.log("[patch-opennext-win] patched copyTracedFiles symlinks to junctions");
