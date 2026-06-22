import BcryptService from "./bcrypt.service.js";
import TokenService from "./token.service.js";

export const bcryptService = new BcryptService();
export const tokenService = new TokenService(bcryptService);
