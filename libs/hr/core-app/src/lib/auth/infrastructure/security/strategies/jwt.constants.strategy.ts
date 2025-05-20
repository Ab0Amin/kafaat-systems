export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'defaultSecretKey',
  expiresIn: '1d', // access token
  refreshIn: '7d', // refresh token
};
