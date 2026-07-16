import { Router } from "express";
import { registerSchema } from "../../../../shared/validators/auth/register.schema.js";
import { loginSchema } from "../../../../shared/validators/auth/login.schema.js";
import asyncHandler from "../../../../shared/utils/async.handler.js";
import validateBody from "../../../../middlewares/validation.middleware.js";
import { adminAuthController } from "../../../../container.js";
import deviceIdMiddleware from "../../../../middlewares/device-id.middleware.js";
import accessCheckerMiddleware from "../../../../middlewares/accessChecker.middleware.js";
import { tokenService } from "../../../../infrastructure/services/services.index.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(adminAuthController.register),
);

router.post(
  "/login",
  deviceIdMiddleware,
  validateBody(loginSchema),
  asyncHandler(adminAuthController.login),
);

router.post(
  "/refresh",
  accessCheckerMiddleware(tokenService, true, true),
  deviceIdMiddleware,
  asyncHandler(adminAuthController.refresh),
);

router.post(
  "/logout",
  accessCheckerMiddleware(tokenService, true, true),
  deviceIdMiddleware,
  asyncHandler(adminAuthController.logout),
);

export default router;
