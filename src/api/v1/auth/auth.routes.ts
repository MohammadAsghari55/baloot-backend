import { Router } from "express";
import { registerSchema } from "../../../shared/validators/auth/register.schema.js";
import asyncHandler from "../../../shared/utils/async.handler.js";
import validateBody from "../../../middlewares/validation.middleware.js";
import { authController } from "../../../application/auth/index.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(authController.register),
);

export default router;
