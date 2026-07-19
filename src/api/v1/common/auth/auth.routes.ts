import { Router } from "express";
import deviceIdMiddleware from "../../../../middlewares/device-id.middleware.js";
import accessCheckerMiddleware from "../../../../middlewares/accessChecker.middleware.js";
import { loginSchema } from "../../../../shared/validators/auth/login.schema.js";
import { ResendVerificationSchema } from "../../../../shared/validators/auth/resend.verification.schema.js";
import { tokenService } from "../../../../infrastructure/services/services.index.js";
import { authController } from "../../../../container.js";
import validateBody from "../../../../middlewares/validation.middleware.js";
import asyncHandler from "../../../../shared/utils/async.handler.js";

const router = Router();

router.post(
  "/login",
  deviceIdMiddleware,
  validateBody(loginSchema),
  asyncHandler(authController.login),
);

router.post(
  "/logout",
  accessCheckerMiddleware(tokenService, true, true),
  deviceIdMiddleware,
  asyncHandler(authController.logout),
);

router.post(
  "/resend",
  validateBody(ResendVerificationSchema),
  asyncHandler(authController.resend),
);

router.post(
  "/changePassword",
  accessCheckerMiddleware(tokenService, true),
  asyncHandler(authController.changePassword),
);
export default router;
