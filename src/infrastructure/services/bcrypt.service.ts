import bcrypt from "bcrypt";
import IBcryptService from "../../domains/user/Interfaces/ibcrypt.service.js";

class BcryptService implements IBcryptService {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }
  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}

export default BcryptService;
