import { Router } from "express";
import validateBodyMiddleware from "../../../middlewares/validation.body.middleware.js";
import { registerSchema } from "../../../shared/validators/auth/register.schema.js";
import { userController } from "../../../container.js";
import asyncHandler from "../../../shared/utils/async.handler.js";

const router = Router();

router.post(
  "/register",
  validateBodyMiddleware(registerSchema),
  asyncHandler(userController.register),
);

export default router;
