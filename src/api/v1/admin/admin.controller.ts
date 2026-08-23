import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterAdminUseCase from "../../../application/auth/usecases/register.admin.usecase.js";
import VerifyRegisterAdminUseCase from "../../../application/auth/usecases/verify.register.admin.usecase.js";
import ResendAdminVerificationUseCase from "../../../application/auth/usecases/resend.admin.verification.usecase.js";

@BoundClass
class AdminController {
  constructor(
    private registerAdminUseCase: RegisterAdminUseCase,
    private verifyRegisterAdminUseCase: VerifyRegisterAdminUseCase,
    private resendAdminVerificationUseCase: ResendAdminVerificationUseCase,
  ) {}

  async register(req: Request, res: Response) {
    const warning = await this.registerAdminUseCase.execute(
      req.body,
      req.userId!,
      req.role!,
    );
    res.status(201).json({
      success: true,
      message:
        "New Admin saved in Redis successfully, please verify to save in database",
      ...(warning && { warning }),
    });
  }

  async verifyRegister(req: Request, res: Response) {
    const { response, warning } = await this.verifyRegisterAdminUseCase.execute(
      req.body,
      req.userId!,
      req.role!,
    );

    res.status(201).json({
      success: true,
      message: "Admin registered successfully, please login",
      data: response,
      ...(warning && { warning }),
    });
  }

  async resendAdminVerification(req: Request, res: Response) {
    const warning = await this.resendAdminVerificationUseCase.execute(
      req.userId!,
      req.role!,
    );

    res.status(200).json({
      success: true,
      message: "Verification code resent successfully.",
      ...(warning && { warning }),
    });
  }
}

export default AdminController;
