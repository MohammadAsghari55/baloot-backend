import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterAdminUseCase from "../../../../application/auth/usecases/register.admin.usecase.js";
import LoginUseCase from "../../../../application/auth/usecases/login.usecase.js";
import RefreshTokenUseCase from "../../../../application/auth/usecases/refresh.token.usecase.js";
import LogoutUseCase from "../../../../application/auth/usecases/logout.usecase.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../../../infrastructure/config/cookie.config.js";

@BoundClass
class AdminAuthController {
  constructor(
    private registerUseCase: RegisterAdminUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
  ) {}

  async register(req: Request, res: Response) {
    const user = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully, please login",
      data: user,
    });
  }

  async login(req: Request, res: Response) {
    const token = await this.loginUseCase.execute(req.body, req.deviceId!);

    res.cookie("accessToken", token.accessToken, accessCookieOptions);
    res.cookie("refreshToken", token.refreshToken, refreshCookieOptions);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  }

  async refresh(req: Request, res: Response) {
    const token = await this.refreshTokenUseCase.execute(
      "admin",
      req.cookies.refreshToken,
      req.user!.userId,
      req.deviceId!,
    );

    res.cookie("accessToken", token.accessToken, accessCookieOptions);
    res.cookie("refreshToken", token.refreshToken, refreshCookieOptions);
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
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
}

export default AdminAuthController;
