export function isStorageUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return error.message === "fetch failed" || error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED");
}
