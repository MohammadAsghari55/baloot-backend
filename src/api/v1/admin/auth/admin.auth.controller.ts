import { BoundClass } from "@hemia/autobind";
import { Request, Response } from "express";
import RegisterAdminUseCase from "../../../../application/auth/usecases/register.admin.usecase.js";
import ForbiddenError from "../../../../shared/errors/forbidden.error.js";

@BoundClass
class AdminAuthController {
  constructor(private registerUseCase: RegisterAdminUseCase) {}

  async register(req: Request, res: Response) {
    if (req.body.role && req.body.role !== "admin") {
      throw new ForbiddenError("INVALID_ROLE");
    }
    const result = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }
}

export default AdminAuthController;
