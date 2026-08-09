import { buildAuthModule } from "./application/auth/auth.index.js";

const {
  adminController,
  userController,
  authController,
  tokenManagementApplicationService,
} = buildAuthModule();

export {
  adminController,
  userController,
  authController,
  tokenManagementApplicationService,
};
