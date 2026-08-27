const errorMessages: Record<string, string> = {
  //Common
  "Invalid input": "Please enter a valid value",
  Required: "This field is required",
  "Expected string, received number": "This field must be text",
  "Expected object, received undefined": "Please provide the required data",
  "Expected string, received null": "This field cannot be null",
  "Invalid date": "Please enter a valid date",
  "Expected number, received string": "This field must be a number",

  //Email
  "Invalid email": "Please enter a valid email address",

  //String
  "String must contain at least 1 character(s)": "This field cannot be empty",
  "String must contain at least 5 character(s)":
    "This field must be at least 5 characters",
  "String must contain at least 8 character(s)":
    "This field must be at least 8 characters",
  "String must contain at most 40 character(s)":
    "This field must be at most 40 characters",
  "String must contain exactly 6 character(s)":
    "This field must be exactly 6 characters",

  //Regex
  "Username can only contain letters, numbers, and underscore (_)":
    "Username can only contain letters, numbers, and underscore (_)",
  "Password must contain at least one uppercase letter":
    "Password must include at least one uppercase letter",
  "Password must contain at least one lowercase letter":
    "Password must include at least one lowercase letter",
  "Password must contain at least one number":
    "Password must include at least one number",
  "Password must contain at least one special character like @ - $ & !":
    "Password must include at least one special character (e.g. @, -, $, &, !)",

  //Refine
  "Passwords do not match": "Passwords do not match",
  "identifier must be at least 5 characters":
    "Username or email must be at least 5 characters",
  "Password is required": "Password is required",
  "Code must be exactly 6 characters":
    "Verification code must be exactly 6 characters",
  "Old password is required": "Old password is required",
};

function zodErrorMapper(
  details: { path: string; message: string }[],
): { path: string; message: string }[] {
  return details.map((detail) => ({
    path: detail.path,
    message: errorMessages[detail.message] || detail.message,
  }));
}

export default zodErrorMapper;
