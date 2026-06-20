import { buildAuthModule } from "./application/auth/index.js";

const { adminAuthController, userAuthController } = buildAuthModule();

export { adminAuthController, userAuthController };
