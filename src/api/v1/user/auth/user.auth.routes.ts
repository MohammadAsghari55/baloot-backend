import { Router } from "express";
import { registerSchema } from "../../../../shared/validators/auth/register.schema.js";
import { loginSchema } from "../../../../shared/validators/auth/login.schema.js";
import asyncHandler from "../../../../shared/utils/async.handler.js";
import validateBody from "../../../../middlewares/validation.middleware.js";
import { userAuthController } from "../../../../container.js";
import deviceIdMiddleware from "../../../../middlewares/device-id.middleware.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(userAuthController.register),
);

router.post(
  "/login",
  deviceIdMiddleware,
  validateBody(loginSchema),
  asyncHandler(userAuthController.login),
);

router.post(
  "/refresh",
  deviceIdMiddleware,
  asyncHandler(userAuthController.refresh),
);

export default router;
