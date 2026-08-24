import { Router } from "express";
import { loginSchema } from "../../../../shared/validators/auth/login.schema.js";
import { ResendVerificationSchema } from "../../../../shared/validators/auth/resend.verification.schema.js";
import { extractorMiddleware } from "../../../../middleware.container.index.js";
import validateBodyMiddleware from "../../../../middlewares/validation.body.middleware.js";
import { authController } from "../../../../container.js";
import asyncHandler from "../../../../shared/utils/async.handler.js";

const router = Router();

router.post(
  "/login",
  extractorMiddleware,
  validateBodyMiddleware(loginSchema),
  asyncHandler(authController.login),
);

router.post(
  "/resend",
  validateBodyMiddleware(ResendVerificationSchema),
  asyncHandler(authController.resend),
);

router.post(
  "/refresh",
  extractorMiddleware,
  asyncHandler(authController.refresh),
);

export default router;
