import express from "express";
import healthRouter from "./api/health/health.route.js";
import authRouter from "./api/v1/auth/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

export const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);
