// Load dotenv.
var dotenv = require('dotenv')
dotenv.load()

module.exports = {
  sessionSecret: process.env.SESSION_SECRET || 'I Am A Monkey',
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 3000,
  stripeSecret: process.env.STRIPE_SECRET,
  homeUrl: 'https://www.operationfortyfive.org',
  notFoundUrl: 'http://www.example.com'
}
