export const VerificationErrors = {
  EMAIL_NOT_VERIFIED: {
    code: "EMAIL_NOT_VERIFIED",
    message:
      "Email address is not verified. Please provide the verification code.",
    status: 403,
  },
  INVALID_VERIFICATION_CODE: {
    code: "INVALID_VERIFICATION_CODE",
    message: "The verification code is invalid or expired.",
    status: 400,
  },
  ALREADY_VERIFIED: {
    code: "ALREADY_VERIFIED",
    message: "Email address is already verified.",
    status: 400,
  },
} as const;
