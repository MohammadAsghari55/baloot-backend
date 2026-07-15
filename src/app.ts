import express from "express";
import healthRouter from "./api/health/health.route.js";
import adminAuthRouter from "./api/v1/admin/auth/admin.auth.routes.js";
import userAuthRouter from "./api/v1/user/auth/user.auth.routes.js";
import resendVerificationRouter from "./api/v1/common/resendVerification/resend.verification.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/v1/admin/auth", adminAuthRouter);
app.use("/api/v1/user/auth", userAuthRouter);
app.use("/api/v1/common/resendVerification", resendVerificationRouter);

app.use(errorMiddleware);
