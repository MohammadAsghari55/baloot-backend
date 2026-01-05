import express from "express";
import { healthRouter } from "./modules/health/health.route";

export const app = express();

app.use(express.json());

app.use("/health", healthRouter);
