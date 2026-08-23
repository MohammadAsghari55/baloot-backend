import PendingAdminData from "../../../type/pending.admin.types.js";

interface IRegisterAdminService {
  savePendingAdmin(
    superAdminId: string,
    data: Omit<PendingAdminData, "code" | "createdAt">,
    code: string,
  ): Promise<boolean>;

  getPendingAdmin(superAdminId: string): Promise<PendingAdminData | null>;

  deletePendingAdmin(superAdminId: string): Promise<void>;
}

export default IRegisterAdminService;
