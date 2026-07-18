import { buildAuthModule } from "./application/auth/auth.index.js";

const { adminController, userController, authController } = buildAuthModule();

export { adminController, userController, authController };
