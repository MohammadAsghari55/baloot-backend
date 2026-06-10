import { randomUUID } from "crypto";

class User {
  private constructor(
    private readonly _id: string,
    private _email: string,
    private _username: string,
    private _passwordHash: string,
    private _role: "user" | "admin",
    private _walletBalance: number,
    private _isEmailVerified: boolean,
    private _wrongPasswordNumber: number,
    private _wrongPasswordUntil: Date | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get username(): string {
    return this._username;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get role(): "user" | "admin" {
    return this._role;
  }
  get walletBalance(): number {
    return this._walletBalance;
  }
  get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get wrongPasswordNumber(): number {
    return this._wrongPasswordNumber;
  }
  get wrongPasswordUntil(): Date | null {
    return this._wrongPasswordUntil;
  }

  static createNew(
    email: string,
    username: string,
    hashedPassword: string,
    role: "user" | "admin" = "user",
  ): User {
    return new User(
      randomUUID(),
      email,
      username,
      hashedPassword,
      role,
      0,
      false,
      0,
      null,
      new Date(),
      new Date(),
    );
  }

  static fromDB(data: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    role: "user" | "admin";
    walletBalance: number;
    isEmailVerified: boolean;
    wrongPasswordNumber: number;
    wrongPasswordUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      data.email,
      data.username,
      data.passwordHash,
      data.role,
      data.walletBalance,
      data.isEmailVerified,
      data.wrongPasswordNumber,
      data.wrongPasswordUntil,
      data.createdAt,
      data.updatedAt,
    );
  }
}

export default User;
