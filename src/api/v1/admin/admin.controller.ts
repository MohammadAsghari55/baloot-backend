import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterAdminUseCase from "../../../application/auth/usecases/register.admin.usecase.js";

@BoundClass
class AdminController {
  constructor(private registerUseCase: RegisterAdminUseCase) {}

  async register(req: Request, res: Response) {
    const userDto = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "Admin registered successfully, please login",
      data: userDto,
    });
  }
}

export default AdminController;
