import { randomUUID } from "crypto";
class PasswordHistory {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _passwordHash: string,
    private readonly _createdAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  static createNew(userId: string, passwordHash: string): PasswordHistory {
    return new PasswordHistory(randomUUID(), userId, passwordHash, new Date());
  }

  static fromDB(data: {
    id: string;
    user_id: string;
    password_hash: string;
    created_at: Date;
  }): PasswordHistory {
    return new PasswordHistory(
      data.id,
      data.user_id,
      data.password_hash,
      data.created_at,
    );
  }
}

export default PasswordHistory;
