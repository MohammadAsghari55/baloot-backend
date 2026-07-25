import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";
import User from "../../../domains/user/entities/user.entity.js";

interface IUserApplicationService {
  findUserByEmail(
    email: string,
    client?: IDatabaseClient,
  ): Promise<User | null>;

  findUserByUsername(
    username: string,
    client?: IDatabaseClient,
  ): Promise<User | null>;

  findUserByIdentifier(
    identifier: string,
    client?: IDatabaseClient,
  ): Promise<User | null>;

  countAdmins(client?: IDatabaseClient): Promise<number>;

  saveUser(user: User, client?: IDatabaseClient): Promise<void>;

  getMaxAdmins(): Promise<number>;

  updateEmailVerified(
    userId: string,
    verified: boolean,
    client?: IDatabaseClient,
  ): Promise<void>;

  updatePassword(
    userId: string,
    hashedPassword: string,
    client?: IDatabaseClient,
  ): Promise<void>;

  findUserById(userId: string, client?: IDatabaseClient): Promise<User | null>;
}

export default IUserApplicationService;
