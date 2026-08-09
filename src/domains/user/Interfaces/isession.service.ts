import SessionData from "../../../type/session.types.js";

interface ISessionService {
  getSession(userId: string, deviceId: string): Promise<SessionData | null>;

  setSession(
    userId: string,
    deviceId: string,
    data: SessionData,
    ttl: number,
  ): Promise<void>;

  getVersion(userId: string): Promise<number | null>;

  getAllUserSessionVersions(userId: string): Promise<number[]>;

  setVersion(userId: string, version: number, ttl: number): Promise<void>;
}

export default ISessionService;
