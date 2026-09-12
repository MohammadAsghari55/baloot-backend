import winston from "winston";
import config from "../config/env.index.js";

const logLevel = config.NODE_ENV === "production" ? "info" : "debug";

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length
          ? `\n${JSON.stringify(meta, null, 2)}`
          : "";
        return `${timestamp} [${level}]: ${message}${metaStr}`;
      }),
    ),
  }),
];

if (config.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  );
}

export const winstonConfig = {
  level: logLevel,
  format,
  transports,
  exitOnError: false,
};
