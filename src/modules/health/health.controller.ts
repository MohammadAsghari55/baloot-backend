import { Request, Response } from "express";
import { healthService } from "./health.service";

export const healthController = {
  check(req: Request, res: Response) {
    const result = healthService.check();
    res.status(200).json(result);
  }
};
