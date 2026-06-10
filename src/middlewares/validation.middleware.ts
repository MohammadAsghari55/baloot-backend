import { RequestHandler } from "express";
import { ZodType, ZodError } from "zod";
import ZodValidationError from "../shared/errors/zod.validation.error.js";

const validateBody = <T>(schema: ZodType<T>): RequestHandler => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ZodValidationError(error));
      }
      next(error);
    }
  };
};

export default validateBody;
