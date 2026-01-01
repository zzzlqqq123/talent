export const jwtConfig = {
  secret: (process.env.JWT_SECRET || 'your-secret-key') as string,
  expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string
}
