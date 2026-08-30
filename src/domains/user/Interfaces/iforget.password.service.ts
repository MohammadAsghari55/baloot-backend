import ResetPasswordData from "../../../type/reset.password.types.js";

interface IForgetPasswordService {
  saveResetCode(userId: string, hashedCode: string): Promise<boolean>;

  getResetCode(userId: string): Promise<ResetPasswordData | null>;

  deleteResetCode(userId: string): Promise<void>;
}

export default IForgetPasswordService;
