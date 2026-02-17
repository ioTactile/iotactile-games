type LogLevel = "info" | "warn" | "error";

const log = (level: LogLevel, message: string, payload?: unknown) => {
  if (process.dev) {
    // eslint-disable-next-line no-console
    console[level === "error" ? "error" : level](message, payload);
  }
};

export const logger = {
  info: (message: string, payload?: unknown) => log("info", message, payload),
  warn: (message: string, payload?: unknown) => log("warn", message, payload),
  error: (message: string, payload?: unknown) => log("error", message, payload),
};

