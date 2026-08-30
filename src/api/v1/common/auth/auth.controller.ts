import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import LoginUseCase from "../../../../application/auth/usecases/login.usecase.js";
import LogoutUseCase from "../../../../application/auth/usecases/logout.usecase.js";
import ChangePasswordUseCase from "../../../../application/auth/usecases/change.password.usecase.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../../../infrastructure/config/cookie.config.js";
import ResendVerificationUseCase from "../../../../application/auth/usecases/resend.verification.usecase.js";
import RefreshTokenUseCase from "../../../../application/auth/usecases/refresh.token.usecase.js";
import ForgetPasswordUseCase from "../../../../application/auth/usecases/forget.password.usecase.js";
import ResetPasswordUseCase from "../../../../application/auth/usecases/reset.password.usecase.js";

@BoundClass
class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private logoutUseCase: LogoutUseCase,
    private resendVerificationUseCase: ResendVerificationUseCase,
    private changePasswordUseCase: ChangePasswordUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private forgetPasswordUseCase: ForgetPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
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

    await this.logoutUseCase.execute(req.userId!, req.deviceId!, logoutAll);

    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: logoutAll
        ? "Logged out from all devices"
        : "Logged out successfully",
    });
  }

  async resendCode(req: Request, res: Response) {
    const result = await this.resendVerificationUseCase.execute(req.body);

    const responseBody = {
      success: true,
      message: "Verification code sent successfully",
      data: result.response,

      ...(result.warning && { warning: result.warning }),
    };

    res.status(200).json(responseBody);
  }

  async changePassword(req: Request, res: Response) {
    await this.changePasswordUseCase.execute(req.body, req.userId!);

    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "Your Password Changed successfully. Please Login Again",
    });
  }

  async refresh(req: Request, res: Response) {
    const token = await this.refreshTokenUseCase.execute(
      req.cookies.refreshToken,
      req.userId!,
      req.deviceId!,
    );

    res.cookie("accessToken", token.accessToken, accessCookieOptions);
    res.cookie("refreshToken", token.refreshToken, refreshCookieOptions);
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  }

  async forgetPassword(req: Request, res: Response) {
    const warning = await this.forgetPasswordUseCase.execute(req.body);

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",

      ...(warning && { warning }),
    });
  }

  async resetPassword(req: Request, res: Response) {
    await this.resetPasswordUseCase.execute(req.body);

    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "Your Password Reset successfully. Please Login Again",
    });
  }
}

export default AuthController;
