import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";
import User from "../../../domains/user/entities/user.entity.js";

interface IUserApplicationService {
  findByEmail(email: string): Promise<User | null>;

  findByUsername(username: string): Promise<User | null>;

  findByIdentifier(identifier: string): Promise<User | null>;

  findById(userId: string, client: IDatabaseClient): Promise<User | null>;

  readById(userId: string): Promise<User | null>;

  countAdmins(): Promise<number>;

  save(user: User, client: IDatabaseClient): Promise<void>;

  getMaxAdmins(): Promise<number>;

  updateEmailVerified(
    userId: string,
    verified: boolean,
    client: IDatabaseClient,
  ): Promise<void>;

  updatePassword(
    userId: string,
    hashedPassword: string,
    passwordChangeTry: number,
    passwordChangeLockedUntil: Date | null,
    client: IDatabaseClient,
  ): Promise<void>;

  updatePasswordChangeFields(
    userId: string,
    passwordChangeTry: number,
    passwordChangeLockedUntil: Date | null,
    client: IDatabaseClient,
  ): Promise<void>;

  increaseVersion(userId: string, client: IDatabaseClient): Promise<number>;
}

export default IUserApplicationService;
