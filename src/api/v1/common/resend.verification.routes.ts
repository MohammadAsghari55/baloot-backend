import { Router } from "express";
import { ResendVerificationSchema } from "../../../shared/validators/auth/resend.verification.schema.js";
import asyncHandler from "../../../shared/utils/async.handler.js";
import validateBody from "../../../middlewares/validation.middleware.js";

import { resendVerificationController } from "../../../container.js";

const router = Router();

router.post(
  "/",
  validateBody(ResendVerificationSchema),
  asyncHandler(resendVerificationController.resend),
);

export default router;
