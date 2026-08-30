import BcryptService from "./bcrypt.service.js";
import TokenService from "./token.service.js";
import EmailService from "./email.service.js";
import SessionService from "../../infrastructure/services/session.service.js";
import RegisterAdminService from "./register.admin.service.js";
import ForgetPasswordService from "./forget.password.service.js";
import redisService from "../redis/redis.service.js";

export const bcryptService = new BcryptService();
export const tokenService = new TokenService();
export const emailService = new EmailService();
export const sessionService = new SessionService(redisService);
export const registerAdminService = new RegisterAdminService(redisService);
export const forgetPasswordService = new ForgetPasswordService(redisService);
