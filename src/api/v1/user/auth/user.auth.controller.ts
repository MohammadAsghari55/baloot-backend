import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterUserUseCase from "../../../../application/auth/usecases/register.user.usecase.js";
import LoginUseCase from "../../../../application/auth/usecases/login.usecase.js";

@BoundClass
class UserAuthController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUseCase,
  ) {}

  async register(req: Request, res: Response) {
    const user = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }

  async login(req: Request, res: Response) {
    const deviceId = req.headers["x-device-id"] as string;
    const token = await this.loginUseCase.execute(req.body, deviceId);

    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  }
}

export default UserAuthController;
