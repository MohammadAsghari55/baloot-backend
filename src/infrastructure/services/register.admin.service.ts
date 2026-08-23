import IRedisService from "../../shared/interfaces/iredis.service.js";
import IRegisterAdminService from "../../domains/user/Interfaces/iregister.admin.service.js";
import PendingAdminData from "../../type/pending.admin.types.js";

class RegisterAdminService implements IRegisterAdminService {
  constructor(private redisService: IRedisService) {}

  private getKey(superAdminId: string): string {
    return `admin-register:${superAdminId}`;
  }

  private readonly TTL = 8 * 60 * 60;

  async savePendingAdmin(
    superAdminId: string,
    data: Omit<PendingAdminData, "code" | "createdAt">,
    code: string,
  ): Promise<boolean> {
    const key = this.getKey(superAdminId);
    const value: PendingAdminData = {
      ...data,
      code,
      createdAt: Date.now(),
    };

    const result = await this.redisService.setIfNotExists(
      key,
      JSON.stringify(value),
      this.TTL,
    );

    return result;
  }

  async getPendingAdmin(
    superAdminId: string,
  ): Promise<PendingAdminData | null> {
    const key = this.getKey(superAdminId);
    const data = await this.redisService.get<string>(key);
    if (!data) return null;
    return JSON.parse(data) as PendingAdminData;
  }

  async deletePendingAdmin(superAdminId: string): Promise<void> {
    const key = this.getKey(superAdminId);
    await this.redisService.del(key);
  }
}

export default RegisterAdminService;
