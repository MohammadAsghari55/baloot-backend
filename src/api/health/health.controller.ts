import { Request, Response } from "express";
import healthService from "../../domains/health/services/health.service.js";

const healthController = {
  check(req: Request, res: Response) {
    const result = healthService.check();
    res.status(200).json(result);
  },
};

export default healthController;
