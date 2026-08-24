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

router.use(extractorMiddleware);
router.use(AccessCheckerMiddleware);

router.post(
  "/register",
  validateBodyMiddleware(registerSchema),
  asyncHandler(adminController.register),
);

router.post(
  "/verifyRegister",
  validateBodyMiddleware(verifyRegisterSchema),
  asyncHandler(adminController.verifyRegister),
);

router.post(
  "/resendAdminVerification",
  asyncHandler(adminController.resendAdminVerification),
);
export default router;
