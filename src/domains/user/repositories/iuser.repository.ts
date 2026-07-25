import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";
import User from "../entities/user.entity.js";
interface IUserRepository {
  findByEmail(email: string, client?: IDatabaseClient): Promise<User | null>;

  findByUsername(
    username: string,
    client?: IDatabaseClient,
  ): Promise<User | null>;

  findById(userId: string, client?: IDatabaseClient): Promise<User | null>;

  save(user: User, client?: IDatabaseClient): Promise<void>;

  countAdmins(client?: IDatabaseClient): Promise<number>;

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
}

export default IUserRepository;
