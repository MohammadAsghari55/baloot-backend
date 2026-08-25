import { randomUUID } from "crypto";

class User {
  private constructor(
    private readonly _id: string,
    private _firstName: string | null,
    private _lastName: string | null,
    private readonly _role: "user" | "admin" | "super_admin",
    private _email: string,
    private _address: string | null,
    private _phoneNumber: string | null,
    private _username: string,
    private _passwordHash: string,
    private _cardNumber: string | null,
    private _birthDate: Date | null,
    private _passwordChangeTry: number,
    private _passwordChangeLockedUntil: Date | null,
    private _wrongPasswordNumber: number,
    private _wrongPasswordUntil: Date | null,
    private _isProfileCompleted: boolean,
    private _isEmailVerified: boolean,
    private _tokenVersion: number,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get firstName(): string | null {
    return this._firstName;
  }

  get lastName(): string | null {
    return this._lastName;
  }

  get role(): "user" | "admin" | "super_admin" {
    return this._role;
  }

  get email(): string {
    return this._email;
  }

  get address(): string | null {
    return this._address;
  }

  get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  get username(): string {
    return this._username;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get cardNumber(): string | null {
    return this._cardNumber;
  }

  get birthDate(): Date | null {
    return this._birthDate;
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

  get isProfileCompleted(): boolean {
    return this._isProfileCompleted;
  }

  get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  get tokenVersion(): number {
    return this._tokenVersion;
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
    role: "user" | "admin" | "super_admin",
  ): User {
    return new User(
      randomUUID(),
      null,
      null,
      role,
      email,
      null,
      null,
      username,
      hashedPassword,
      null,
      null,
      0,
      null,
      0,
      null,
      false,
      false,
      1,
      new Date(),
      new Date(),
    );
  }

  static fromDB(data: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    role: "user" | "admin" | "super_admin";
    email: string;
    address: string | null;
    phone_number: string | null;
    username: string;
    password_hash: string;
    card_number: string | null;
    birth_date: Date | null;
    password_change_try: number;
    password_change_locked_until: Date | null;
    wrong_password_number: number;
    wrong_password_until: Date | null;
    is_profile_completed: boolean;
    is_email_verified: boolean;
    token_version: number;
    created_at: Date;
    updated_at: Date;
  }): User {
    return new User(
      data.id,
      data.first_name,
      data.last_name,
      data.role,
      data.email,
      data.address,
      data.phone_number,
      data.username,
      data.password_hash,
      data.card_number,
      data.birth_date,
      data.password_change_try,
      data.password_change_locked_until,
      data.wrong_password_number,
      data.wrong_password_until,
      data.is_profile_completed,
      data.is_email_verified,
      data.token_version,
      data.created_at,
      data.updated_at,
    );
  }
}

export default User;
