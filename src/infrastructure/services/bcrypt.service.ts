import bcrypt from "bcrypt";
import IPasswordHasher from "../../domains/user/Interfaces/ipassword.hasher.js";

class BcryptService implements IPasswordHasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }
  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}

export default BcryptService;
