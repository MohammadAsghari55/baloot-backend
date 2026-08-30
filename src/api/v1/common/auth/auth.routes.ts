import { Router } from "express";
import { loginSchema } from "../../../../shared/validators/auth/login.schema.js";
import { identifierSchema } from "../../../../shared/validators/auth/identifier.schema.js";
import { resetPasswordSchema } from "../../../../shared/validators/auth/reset.password.schema.js";
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
  "/resendCode",
  validateBodyMiddleware(identifierSchema),
  asyncHandler(authController.resendCode),
);

router.post(
  "/refresh",
  extractorMiddleware,
  asyncHandler(authController.refresh),
);

router.post(
  "/forgetPassword",
  validateBodyMiddleware(identifierSchema),
  asyncHandler(authController.forgetPassword),
);

router.post(
  "/resetPassword",
  validateBodyMiddleware(resetPasswordSchema),
  asyncHandler(authController.resetPassword),
);

export default router;
