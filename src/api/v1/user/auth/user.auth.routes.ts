import { Router } from "express";
import { registerSchema } from "../../../../shared/validators/auth/register.schema.js";
import { loginSchema } from "../../../../shared/validators/auth/login.schema.js";
import asyncHandler from "../../../../shared/utils/async.handler.js";
import validateBody from "../../../../middlewares/validation.middleware.js";
import { userAuthController } from "../../../../application/auth/index.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(userAuthController.register),
);

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(userAuthController.login),
);

export default router;
