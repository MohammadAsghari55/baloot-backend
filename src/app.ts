import express from "express";
import healthRouter from "./api/health/health.route.js";
import adminRouter from "./api/v1/admin/admin.routes.js";
import userRouter from "./api/v1/user/user.routes.js";
import authRouter from "./api/v1/common/auth/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/common/auth", authRouter);

app.use(errorMiddleware);
