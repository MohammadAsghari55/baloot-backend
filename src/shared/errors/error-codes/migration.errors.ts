export const MigrationErrors = {
  MIGRATION_FILE_INVALID: {
    code: "MIGRATION_FILE_INVALID",
    message: "Migration file is missing UP/DOWN sections",
    status: 500,
  },
  MIGRATION_EXECUTION_FAILED: {
    code: "MIGRATION_EXECUTION_FAILED",
    message: "Failed to execute migration file",
    status: 500,
  },
} as const;
