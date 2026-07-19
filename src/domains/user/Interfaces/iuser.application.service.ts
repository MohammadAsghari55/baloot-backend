import { PoolClient } from "pg";
import User from "../../../domains/user/entities/user.entity.js";

interface IUserApplicationService {
  findUserByEmail(email: string, client?: PoolClient): Promise<User | null>;
  findUserByUsername(
    username: string,
    client?: PoolClient,
  ): Promise<User | null>;
  findUserByIdentifier(
    identifier: string,
    client?: PoolClient,
  ): Promise<User | null>;
  countAdmins(client?: PoolClient): Promise<number>;
  saveUser(user: User, client?: PoolClient): Promise<void>;
  getMaxAdmins(): Promise<number>;
  updateEmailVerified(
    userId: string,
    verified: boolean,
    client?: PoolClient,
  ): Promise<void>;
  updatePassword(
    userId: string,
    hashedPassword: string,
    client?: PoolClient,
  ): Promise<void>;
}

export default IUserApplicationService;
