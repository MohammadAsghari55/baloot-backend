import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterUserUseCase from "../../../application/auth/usecases/register.user.usecase.js";

@BoundClass
class AuthController {
  constructor(private registerUseCase: RegisterUserUseCase) {}

  async register(req: Request, res: Response) {
    const result = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }
}

export default AuthController;
