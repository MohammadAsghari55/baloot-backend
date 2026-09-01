import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";
import User from "../../../domains/user/entities/user.entity.js";

interface IUserApplicationService {
  findByEmail(email: string): Promise<User | null>;

  findByUsername(username: string): Promise<User | null>;

  findByIdentifier(
    identifier: string,
    client: IDatabaseClient,
  ): Promise<User | null>;

  readByIdentifier(
    identifier: string,
  ): Promise<Pick<User, "id" | "email"> | null>;

  findById(userId: string, client: IDatabaseClient): Promise<User | null>;

  readById(userId: string): Promise<User | null>;

  save(user: User, client: IDatabaseClient): Promise<void>;

  saveAdmin(
    user: User,
    maxAdmins: number,
    client: IDatabaseClient,
  ): Promise<boolean>;

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

  updateUserProfile(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      address: string;
      phoneNumber: string;
      birthDate?: Date | null;
    },
    client: IDatabaseClient,
  ): Promise<number>;

  increaseVersion(userId: string, client: IDatabaseClient): Promise<number>;

  incrementWrongPasswordNumber(
    userId: string,
    client: IDatabaseClient,
  ): Promise<number>;

  resetWrongPasswordNumber(
    userId: string,
    client: IDatabaseClient,
  ): Promise<void>;

  setWrongPasswordUntil(
    userId: string,
    until: Date,
    client: IDatabaseClient,
  ): Promise<void>;
}

export default IUserApplicationService;
