import { Router } from "express";
import {
  extractorMiddleware,
  AccessCheckerMiddleware,
} from "../../../middleware.container.index.js";
import validateBodyMiddleware from "../../../middlewares/validation.body.middleware.js";
import { registerSchema } from "../../../shared/validators/auth/register.schema.js";
import { verifyRegisterSchema } from "../../../shared/validators/auth/verify.register.schema.js";
import { adminController } from "../../../container.js";
import asyncHandler from "../../../shared/utils/async.handler.js";

const router = Router();

router.post(
  "/register",
  extractorMiddleware,
  AccessCheckerMiddleware,
  validateBodyMiddleware(registerSchema),
  asyncHandler(adminController.register),
);

router.post(
  "/verifyRegister",
  extractorMiddleware,
  AccessCheckerMiddleware,
  validateBodyMiddleware(verifyRegisterSchema),
  asyncHandler(adminController.verifyRegister),
);

router.post(
  "/resendAdminVerification",
  extractorMiddleware,
  AccessCheckerMiddleware,
  asyncHandler(adminController.resendAdminVerification),
);
export default router;
