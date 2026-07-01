export class AccountStorageConfigurationError extends Error {
  constructor(readonly reason: string) {
    super(`Account storage is not configured for persistent Redis storage: ${reason}`);
    this.name = "AccountStorageConfigurationError";
  }
}

export function isStorageUnavailableError(error: unknown): boolean {
  if (error instanceof AccountStorageConfigurationError) return true;
  if (!(error instanceof Error)) return false;

  return error.message === "fetch failed" || error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED");
}
