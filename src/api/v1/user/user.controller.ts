import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterUserUseCase from "../../../application/auth/usecases/register.user.usecase.js";

@BoundClass
class UserController {
  constructor(private registerUseCase: RegisterUserUseCase) {}

  async register(req: Request, res: Response) {
    const userDto = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully, please login",
      data: userDto,
    });
  }
}

export default UserController;
