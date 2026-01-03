import { Request, Response, NextFunction } from "express";
import logger from "../logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    };

    if (res.statusCode >= 500) {
      logger.error("API request failed", logData);
    } else if (res.statusCode >= 400) {
      logger.warn("API request error", logData);
    } else {
      logger.info("API request", logData);
    }
  });

  next();
};
