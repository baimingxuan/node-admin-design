export default {
  environment: 'prod',
  port: 3000,
  database: {
    database: 'admin-design',
    username: 'root',
    password: '123456789',
    host: 'localhost',
    port: 3306
  },
  security: {
    secretKey: 'admin-design_secret',
    expiresIn: 60 * 60 * 24 * 7
  }
}
