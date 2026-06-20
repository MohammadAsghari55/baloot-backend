import envSchema from "./env.schema.js";

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const errors = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  console.error(
    JSON.stringify(
      {
        code: "ENV_VALIDATION_ERROR",
        message: "Environment validation failed",
        details: errors,
      },
      null,
      2,
    ),
  );

  process.exit(1);
}

export const config = result.data;
