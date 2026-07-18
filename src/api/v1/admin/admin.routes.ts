import { Router } from "express";
import deviceIdMiddleware from "../../../middlewares/device-id.middleware.js";
import accessCheckerMiddleware from "../../../middlewares/accessChecker.middleware.js";
import { registerSchema } from "../../../shared/validators/auth/register.schema.js";
import { tokenService } from "../../../infrastructure/services/services.index.js";
import { adminController } from "../../../container.js";
import validateBody from "../../../middlewares/validation.middleware.js";
import asyncHandler from "../../../shared/utils/async.handler.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(adminController.register),
);

router.post(
  "/refresh",
  accessCheckerMiddleware(tokenService, true, true),
  deviceIdMiddleware,
  asyncHandler(adminController.refresh),
);

export default router;
