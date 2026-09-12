import winston from "winston";
import { winstonConfig } from "./winston.config.js";

const winstonLogger = winston.createLogger(winstonConfig);

export default winstonLogger;
