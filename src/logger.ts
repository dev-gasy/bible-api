import winston from "winston";
import Transport from "winston-transport";
import * as Sentry from "@sentry/node";

const logLevel = process.env.LOG_LEVEL || "info";

class SentryTransport extends Transport {
  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { level, message, ...meta } = info;

    if (level === "error") {
      Sentry.captureException(new Error(message), {
        level: "error",
        extra: meta,
      });
    } else if (level === "warn") {
      Sentry.captureMessage(message, {
        level: "warning",
        extra: meta,
      });
    }

    callback();
  }
}

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        ({ level, message, timestamp, ...metadata }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
          }
          return msg;
        }
      )
    ),
  }),
];

if (process.env.SENTRY_DSN) {
  transports.push(new SentryTransport());
}

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "bible-api" },
  transports,
});

export default logger;
