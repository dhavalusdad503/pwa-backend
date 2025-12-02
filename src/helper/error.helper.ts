import {
  DatabaseError,
  ExclusionConstraintError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";

export interface ErrorWithStatus extends Error {
  status?: number;
}

interface PostgresError extends Error {
  routine?: string;
  detail?: string;
  schema?: string;
  table?: string;
  constraint?: string;
}

export interface ErrorWithFullResponse extends Error {
  fullResponse?: object;
}

export function extractErrorMessage(
  error: unknown,
  defaultMessage: string = "An error occurred"
): string {
  // 1. Unique constraint
  if (error instanceof UniqueConstraintError) {
    const field = Object.keys(error.fields || {})[0] || "Field";
    const value = error.fields?.[field];
    return `${capitalize(field.replace(/_/g, " "))} '${value}' already exists.`;
  }

  // 2. Validation error (generic)
  if (error instanceof ValidationError) {
    if (error.errors?.length > 0) {
      return error.errors.map((e) => e.message).join(", "); // combine all validation messages
    }
    if (typeof error === "object" && error !== null && "parent" in error) {
      const errObj = error as { parent?: { detail?: string } };
      if (errObj.parent?.detail) {
        return errObj.parent.detail;
      }
    }
    return error.message;
  }

  // 3. Foreign key constraint error

  if (error instanceof ForeignKeyConstraintError) {
    const parent = error.parent as PostgresError;
    return `Cannot ${
      parent?.routine === "_bt_check_unique" ? "insert" : "delete/update"
    } record: ${error.message}`;
  }

  // 4. Exclusion constraint
  if (error instanceof ExclusionConstraintError) {
    return `Exclusion constraint violated: ${error.message}`;
  }

  // 5. Database errors
  if (error instanceof DatabaseError) {
    return error.message || defaultMessage;
  }

  // 6. Generic JS error
  if (error instanceof Error) {
    return error.message;
  }

  // 7. Fallback
  return defaultMessage;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function extractErrorStatus(
  error: unknown,
  defaultStatus: number = 400
): number {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as ErrorWithStatus).status;
    return typeof status === "number" ? status : defaultStatus;
  }
  if (error instanceof Error) {
    return 500;
  }
  return defaultStatus;
}

export function extractErrorInfo(
  error: unknown,
  defaultMessage: string = "An error occurred",
  defaultStatus: number = 400
): { message: string; status: number } {
  return {
    message: extractErrorMessage(error, defaultMessage),
    status: extractErrorStatus(error, defaultStatus),
  };
}
