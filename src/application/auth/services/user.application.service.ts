import { PoolClient } from "pg";
import User from "../../../domains/user/entities/user.entity.js";
import IUserRepository from "../../../domains/user/repositories/iuser.repository.js";
import config from "../../../infrastructure/config/env.index.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";

class UserApplicationService implements IUserApplicationService {
  constructor(private userRepository: IUserRepository) {}

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

  async updateEmailVerified(
    userId: string,
    verified: boolean,
    client?: PoolClient,
  ): Promise<void> {
    await this.userRepository.updateEmailVerified(userId, verified, client);
  }

  async updatePassword(
    userId: string,
    hashedPassword: string,
    client?: PoolClient,
  ): Promise<void> {
    await this.userRepository.updatePassword(userId, hashedPassword, client);
  }
}

export default UserApplicationService;
