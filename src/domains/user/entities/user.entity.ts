import { randomUUID } from "crypto";

class User {
  private constructor(
    private readonly _id: string,
    private _email: string,
    private _username: string,
    private _passwordHash: string,
    private readonly _role: "user" | "admin",
    private _walletBalance: number,
    private _isEmailVerified: boolean,
    private _passwordChangeTry: number,
    private _passwordChangeLockedUntil: Date | null,
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
  get passwordChangeTry(): number {
    return this._passwordChangeTry;
  }
  get passwordChangeLockedUntil(): Date | null {
    return this._passwordChangeLockedUntil;
  }

  get wrongPasswordNumber(): number {
    return this._wrongPasswordNumber;
  }
  get wrongPasswordUntil(): Date | null {
    return this._wrongPasswordUntil;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
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
    password_hash: string;
    role: "user" | "admin";
    wallet_balance: number;
    is_email_verified: boolean;
    password_change_try: number;
    password_change_locked_until: Date | null;
    wrong_password_number: number;
    wrong_password_until: Date | null;
    created_at: Date;
    updated_at: Date;
  }): User {
    return new User(
      data.id,
      data.email,
      data.username,
      data.password_hash,
      data.role,
      data.wallet_balance,
      data.is_email_verified,
      data.password_change_try,
      data.password_change_locked_until,
      data.wrong_password_number,
      data.wrong_password_until,
      data.created_at,
      data.updated_at,
    );
  }
}

export default User;
