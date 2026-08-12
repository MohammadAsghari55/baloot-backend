import User from "../../../domains/user/entities/user.entity.js";
import IDatabaseClient from "../../../domains/shared/interfaces/idatabase.client.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IUserRepository from "../../../domains/user/repositories/iuser.repository.js";
import config from "../../../infrastructure/config/env.index.js";

class UserApplicationService implements IUserApplicationService {
  constructor(private userRepository: IUserRepository) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    if (isEmail) {
      return this.userRepository.findByEmail(identifier);
    }
    return this.userRepository.findByUsername(identifier);
  }

  async findUserById(
    userId: string,
    client: IDatabaseClient,
  ): Promise<User | null> {
    return this.userRepository.findById(userId, client);
  }

  async countAdmins(): Promise<number> {
    return this.userRepository.countAdmins();
  }

  async saveUser(user: User, client: IDatabaseClient): Promise<void> {
    await this.userRepository.insertUser(user, client);
  }

  async getMaxAdmins(): Promise<number> {
    return config.MAX_ADMINS;
  }

  async updateEmailVerified(
    userId: string,
    verified: boolean,
    client: IDatabaseClient,
  ): Promise<void> {
    await this.userRepository.updateEmailVerified(userId, verified, client);
  }

  async updatePassword(
    userId: string,
    hashedPassword: string,
    passwordChangeTry: number,
    passwordChangeLockedUntil: Date | null,
    client: IDatabaseClient,
  ): Promise<void> {
    await this.userRepository.updatePassword(
      userId,
      hashedPassword,
      passwordChangeTry,
      passwordChangeLockedUntil,
      client,
    );
  }

  async updatePasswordChangeFields(
    userId: string,
    passwordChangeTry: number,
    passwordChangeLockedUntil: Date | null,
    client: IDatabaseClient,
  ): Promise<void> {
    await this.userRepository.updatePasswordChangeFields(
      userId,
      passwordChangeTry,
      passwordChangeLockedUntil,
      client,
    );
  }
}

export default UserApplicationService;
