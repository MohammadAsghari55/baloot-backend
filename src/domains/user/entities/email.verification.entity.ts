import { randomUUID } from "crypto";

class EmailVerification {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _hashedCode: string,
    private readonly _createdAt: Date,
    private readonly _expiresAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get hashedCode(): string {
    return this._hashedCode;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get expiresAt(): Date {
    return this._expiresAt;
  }

  static createNew(
    userId: string,
    hashedCode: string,
    expiresAt: Date,
  ): EmailVerification {
    return new EmailVerification(
      randomUUID(),
      userId,
      hashedCode,
      new Date(),
      expiresAt,
    );
  }

  static fromDB(data: {
    id: string;
    user_id: string;
    hashed_code: string;
    created_at: Date;
    expires_at: Date;
  }): EmailVerification {
    return new EmailVerification(
      data.id,
      data.user_id,
      data.hashed_code,
      data.created_at,
      data.expires_at,
    );
  }
}

export default EmailVerification;
