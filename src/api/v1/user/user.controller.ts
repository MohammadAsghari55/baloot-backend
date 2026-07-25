import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterUserUseCase from "../../../application/auth/usecases/register.user.usecase.js";
import RefreshTokenUseCase from "../../../application/auth/usecases/refresh.token.usecase.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../../infrastructure/config/cookie.config.js";

@BoundClass
class UserController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async register(req: Request, res: Response) {
    const userDto = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully, please login",
      data: userDto,
    });
  }

  async refresh(req: Request, res: Response) {
    const token = await this.refreshTokenUseCase.execute(
      "user",
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
}

export default UserController;
