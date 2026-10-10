// eslint-disable-next-line @typescript-eslint/no-require-imports -- Loaded by the Next plugin through CommonJS.
const { globSync } = require("tinyglobby");

// Next's root discovery needs fast-glob's non-recursive directory semantics.
// This adapter covers the pinned plugin's one call site, not the full fast-glob API.
exports.globSync = (patterns, options) =>
  globSync(patterns, { ...options, expandDirectories: false });
