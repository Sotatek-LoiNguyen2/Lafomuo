export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  apiKey: process.env.API_KEY,
  isDev: process.env.APP_ENV === 'development',
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  jwt: {
    publicKey: Buffer.from(
      process.env.JWT_PUBLIC_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    privateKey: Buffer.from(
      process.env.JWT_PRIVATE_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    accessTokenExpiresInSec: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC,
      10,
    ),
    refreshTokenExpiresInSec: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC,
      10,
    ),
  },
  storeConfig: {
    path: process.env.STORE_FOLDER || '',
    url: process.env.STORE_URL || '',
    host: process.env.STORE_HOST,
  },
  SECRET_KEY: process.env.SECRET_KEY
});
