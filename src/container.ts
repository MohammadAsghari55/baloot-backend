import { buildAuthModule } from "./application/auth/auth.index.js";

const { adminAuthController, userAuthController } = buildAuthModule();

export { adminAuthController, userAuthController };
