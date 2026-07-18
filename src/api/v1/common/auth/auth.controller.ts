import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import LoginUseCase from "../../../../application/auth/usecases/login.usecase.js";
import LogoutUseCase from "../../../../application/auth/usecases/logout.usecase.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../../../infrastructure/config/cookie.config.js";
import ResendVerificationUseCase from "../../../../application/auth/usecases/resend.verification.usecase.js";

@BoundClass
class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private logoutUseCase: LogoutUseCase,
    private resendVerificationUseCase: ResendVerificationUseCase,
  ) {}

  async login(req: Request, res: Response) {
    const token = await this.loginUseCase.execute(req.body, req.deviceId!);

    res.cookie("accessToken", token.accessToken, accessCookieOptions);
    res.cookie("refreshToken", token.refreshToken, refreshCookieOptions);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  }

  async logout(req: Request, res: Response) {
    const logoutAll = req.query.all === "true";

    await this.logoutUseCase.execute(
      req.user!.userId,
      req.deviceId!,
      logoutAll,
    );

    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);
    res.status(200).json({
      success: true,
      message: logoutAll
        ? "Logged out from all devices"
        : "Logged out successfully",
    });
  }

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

export default AuthController;
