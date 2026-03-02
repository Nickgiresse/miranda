// Regex validation email stricte
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
  return regex.test(email.trim())
}

// Validation mot de passe
export function isValidPassword(
  password: string
): { valid: boolean; message: string } {
  if (password.length < 6) {
    return {
      valid: false,
      message: "Minimum 6 caractères",
    }
  }
  return { valid: true, message: "" }
}
