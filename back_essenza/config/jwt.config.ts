export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'sua-chave-super-secreta-para-jwt-em-producao-mude-esta-chave',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
