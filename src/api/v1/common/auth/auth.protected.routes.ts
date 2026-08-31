import { Router } from "express";
import { changePasswordSchema } from "../../../../shared/validators/auth/change.password.schema.js";
import {
  extractorMiddleware,
  AccessCheckerMiddleware,
} from "../../../../middleware.container.index.js";
import fullAccessGuardMiddleware from "../../../../middlewares/full.access.guard.middleware.js";
import validateBodyMiddleware from "../../../../middlewares/validation.body.middleware.js";
import { authController } from "../../../../container.js";
import asyncHandler from "../../../../shared/utils/async.handler.js";

const router = Router();

router.use(extractorMiddleware);
router.use(AccessCheckerMiddleware);

router.post("/logout", asyncHandler(authController.logout));

router.post(
  "/changePassword",
  fullAccessGuardMiddleware,
  validateBodyMiddleware(changePasswordSchema),
  asyncHandler(authController.changePassword),
);

export default router;
