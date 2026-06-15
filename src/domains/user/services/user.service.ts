import { PoolClient } from "pg";
import User from "../entities/user.entity.js";
import UserRepository from "../repositories/user.repository.js";
import ConflictError from "../../../shared/errors/conflict.error.js";
import ForbiddenError from "../../../shared/errors/forbidden.error.js";
import IPasswordHasher from "../Interfaces/ipassword.hasher.js";

class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

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
    return this.passwordHasher.hash(plainPassword);
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

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return this.passwordHasher.compare(plainPassword, hashedPassword);
  }

  async findUserByUsername(
    username: string,
    client?: PoolClient,
  ): Promise<User | null> {
    return this.userRepository.findByUsername(username, client);
  }
}
export default UserService;
