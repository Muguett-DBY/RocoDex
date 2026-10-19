import { cpSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

mkdirSync("archive/rocodex/public", { recursive: true });
cpSync("public/images", "archive/rocodex/public/images", { recursive: true });
cpSync("src/app/favicon.ico", "archive/rocodex/public/favicon.ico");
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build", "archive/rocodex"], { stdio: "inherit" });
process.exit(result.status ?? 1);
