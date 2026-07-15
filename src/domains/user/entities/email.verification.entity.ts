import { randomUUID } from "crypto";
class EmailVerification {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _code: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date | null,
    private readonly _expiresAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get code(): string {
    return this._code;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date | null {
    return this._updatedAt;
  }
  get expiresAt(): Date {
    return this._expiresAt;
  }

  static createNew(userId: string, code: string): EmailVerification {
    return new EmailVerification(
      randomUUID(),
      userId,
      code,
      new Date(),
      null,
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );
  }

  static fromDB(data: {
    id: string;
    user_id: string;
    code: string;
    created_at: Date;
    updated_at: Date;
    expires_at: Date;
  }): EmailVerification {
    return new EmailVerification(
      data.id,
      data.user_id,
      data.code,
      data.created_at,
      data.updated_at,
      data.expires_at,
    );
  }
}

export default EmailVerification;
