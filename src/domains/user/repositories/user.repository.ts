import { PoolClient } from "pg";
import User from "../entities/user.entity.js";
interface IUserRepository {
  findByEmail(email: string, client?: PoolClient): Promise<User | null>;

  findByUsername(username: string, client?: PoolClient): Promise<User | null>;

  save(user: User, client?: PoolClient): Promise<void>;

  countAdmins(client?: PoolClient): Promise<number>;
}

export default IUserRepository;
