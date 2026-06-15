import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterUserUseCase from "../../../../application/auth/usecases/register.user.usecase.js";
import LoginUseCase from "../../../../application/auth/usecases/login.usecase.js";
import ForbiddenError from "../../../../shared/errors/forbidden.error.js";
import TokenService from "../../../../infrastructure/services/token.service.js";
import IRefreshTokenRepository from "../../../../domains/user/repositories/refresh.token.repository.js";
@BoundClass
class UserAuthController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUseCase,
    private tokenService: TokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async register(req: Request, res: Response) {
    if (req.body.role && req.body.role !== "user") {
      throw new ForbiddenError("INVALID_ROLE");
    }
    const result = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }

  async login(req: Request, res: Response) {
    const userInfo = await this.loginUseCase.execute(req.body);
    const accessToken = this.tokenService.generateAccessToken(
      userInfo.userId,
      userInfo.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken();
    const hashedRefreshToken =
      await this.tokenService.hashRefreshToken(refreshToken);

    await this.refreshTokenRepository.saveToken(
      hashedRefreshToken,
      userInfo.userId,
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
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
