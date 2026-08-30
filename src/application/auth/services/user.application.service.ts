import User from "../../../domains/user/entities/user.entity.js";
import IDatabaseClient from "../../../domains/shared/interfaces/idatabase.client.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IUserRepository from "../../../domains/user/repositories/iuser.repository.js";

class UserApplicationService implements IUserApplicationService {
  constructor(private userRepository: IUserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    if (isEmail) {
      return this.userRepository.findByEmail(identifier);
    }
    return this.userRepository.findByUsername(identifier);
  }

  async readByIdentifier(
    identifier: string,
  ): Promise<Pick<User, "id" | "email"> | null> {
    return this.userRepository.readByIdentifier(identifier);
  }

  async findById(
    userId: string,
    client: IDatabaseClient,
  ): Promise<User | null> {
    return this.userRepository.findById(userId, client);
  }

  async readById(userId: string): Promise<User | null> {
    return this.userRepository.readById(userId);
  }

  async save(user: User, client: IDatabaseClient): Promise<void> {
    await this.userRepository.save(user, client);
  }

  async saveAdmin(
    user: User,
    maxAdmins: number,
    client: IDatabaseClient,
  ): Promise<boolean> {
    return this.userRepository.saveAdmin(user, maxAdmins, client);
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

  async increaseVersion(
    userId: string,
    client: IDatabaseClient,
  ): Promise<number> {
    return this.userRepository.increaseVersion(userId, client);
  }
}

export default UserApplicationService;
