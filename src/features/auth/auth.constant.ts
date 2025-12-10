export const AUTH_MESSAGES = {
  USER_NOT_FOUND: "User Not Found",
  USER_NOT_ACTIVE: "User is not active",
  FORGOT_PASSWORD_LINK_SENT: "Password reset link sent to your email",
  SAME_PREVIOUS_PASSWORD:
    "Your current and previous password could not be same",
  INVALID_TOKEN: "Invalid Token",
  PASSWORD_RESET: "Password reset successfully",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  DEFAULT_ORG_NOT_FOUND: "Default organization not found",
};

export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const RESET_PASS_TOKEN_EXPIRY_MINUTES = 5;
export const REDIS_RESET_PASSWORD_KEY_PREFIX = "reset_password_token";
export const DEFAULT_ORG_NAME = "organization1";
