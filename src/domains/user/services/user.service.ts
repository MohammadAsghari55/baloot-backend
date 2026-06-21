import { PoolClient } from "pg";
import User from "../entities/user.entity.js";
import UserRepository from "../repositories/user.repository.js";
import ConflictError from "../../../shared/errors/conflict.error.js";
import ForbiddenError from "../../../shared/errors/forbidden.error.js";
import { config } from "../../../infrastructure/config/index.js";

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

  async findUserByUsername(
    username: string,
    client?: PoolClient,
  ): Promise<User | null> {
    return this.userRepository.findByUsername(username, client);
  }

  async findUserByIdentifier(
    identifier: string,
    client?: PoolClient,
  ): Promise<User | null> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (isEmail) {
      return this.userRepository.findByEmail(identifier, client);
    } else {
      return this.userRepository.findByUsername(identifier, client);
    }
  }

  async checkAdminLimit(client?: PoolClient): Promise<void> {
    const adminsNumber = await this.userRepository.countAdmins(client);
    const maxAdmins = config.MAX_ADMINS;

    if (adminsNumber >= maxAdmins) {
      throw new ForbiddenError("MAX_ADMINS_EXCEEDED");
    }
  }
}
export default UserService;
