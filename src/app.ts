import express from "express";
import { healthRouter } from "./api/health/health.route";
import { errorMiddleware } from "./middlewares/error-middleware";

export const app = express();

app.use(express.json());

app.use("/health", healthRouter);








app.use(errorMiddleware)