import { PoolClient } from "pg";
import bcrypt from "bcrypt";
import User from "../entities/user.entity.js";
import UserRepository from "../repositories/user.repository.js";
import ConflictError from "../../../shared/errors/conflict.error.js";
import ForbiddenError from "../../../shared/errors/forbidden.error.js";

class UserService {
  constructor(private userRepository: UserRepository) {}

  async checkUniqueness(
    email: string,
    username: string,
    role: "user" | "admin",
    client?: PoolClient,
  ): Promise<void> {
    const existingEmail = await this.userRepository.findByEmail(email, client);
    if (existingEmail) {
      throw new ConflictError("EMAIL_EXISTS");
    }

    const existingUsername = await this.userRepository.findByUsername(
      username,
      client,
    );
    if (existingUsername) {
      throw new ConflictError("USERNAME_EXISTS");
    }

    if (role === "admin") {
      const existingAdmin = await this.userRepository.findAdmin(client);
      if (existingAdmin) throw new ForbiddenError("ADMIN_EXISTS");
    }
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }

  createUserEntity(
    email: string,
    username: string,
    hashedPassword: string,
    role: "user" | "admin" = "user",
  ): User {
    return User.createNew(email, username, hashedPassword, role);
  }

  async saveUser(user: User, client?: PoolClient): Promise<void> {
    await this.userRepository.save(user, client);
  }
}
export default UserService;
