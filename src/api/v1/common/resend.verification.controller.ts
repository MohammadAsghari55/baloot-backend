import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import ResendVerificationUseCase from "../../../application/auth/usecases/resend.verification.usecase.js";

@BoundClass
class ResendVerificationController {
  constructor(private resendVerificationUseCase: ResendVerificationUseCase) {}

  async resend(req: Request, res: Response) {
    const result = await this.resendVerificationUseCase.execute(req.body);

    const responseBody = {
      success: true,
      message: "Verification code sent successfully",
      data: result.response,
      ...(result.warning && { warning: result.warning }),
    };

    res.status(200).json(responseBody);
  }
}

export default ResendVerificationController;
