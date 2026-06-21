import { PoolClient } from "pg";
import User from "../../../domains/user/entities/user.entity.js";
import UserRepository from "../../../domains/user/repositories/user.repository.js";
import { config } from "../../../infrastructure/config/index.js";

class UserApplicationService {
  constructor(private userRepository: UserRepository) {}

  async findUserByEmail(
    email: string,
    client?: PoolClient,
  ): Promise<User | null> {
    return this.userRepository.findByEmail(email, client);
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
    }
    return this.userRepository.findByUsername(identifier, client);
  }

  async countAdmins(client?: PoolClient): Promise<number> {
    return this.userRepository.countAdmins(client);
  }

  async saveUser(user: User, client?: PoolClient): Promise<void> {
    await this.userRepository.save(user, client);
  }

  async getMaxAdmins(): Promise<number> {
    return config.MAX_ADMINS;
  }
}

export default UserApplicationService;
