export const PASSWORD_REQUIREMENTS =
  "Password must be 8-100 characters and contain at least one letter and one number.";

export function getPasswordValidationError(password: string) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 100)
    return "Password must not exceed 100 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return "";
}
