import path from "node:path";

export default {
  output: "export",
  poweredByHeader: false,
  images: { unoptimized: true },
  turbopack: { root: path.resolve(process.cwd()) },
};
