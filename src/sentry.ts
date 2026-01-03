import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { Express } from "express";

export const initSentry = (app: Express) => {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    console.warn("SENTRY_DSN not configured. Sentry will not be initialized.");
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || "development",
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  Sentry.setupExpressErrorHandler(app);
};

export default Sentry;
