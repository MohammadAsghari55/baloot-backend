import { buildAuthModule } from "./application/auth/auth.index.js";

const {
  adminController,
  userController,
  authController,
  userApplicationService,
  tokenManagementApplicationService,
} = buildAuthModule();

export {
  adminController,
  userController,
  authController,
  userApplicationService,
  tokenManagementApplicationService,
};
