import { buildAuthModule } from "./application/auth/auth.index.js";

const {
  adminAuthController,
  userAuthController,
  resendVerificationController,
} = buildAuthModule();

export {
  adminAuthController,
  userAuthController,
  resendVerificationController,
};
