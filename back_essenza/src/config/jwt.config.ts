export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'jwt-secret-key-change-in-production',
  expiresIn: '1h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production',
  refreshExpiresIn: '7d',
};
