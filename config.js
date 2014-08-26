module.exports = {
  sessionSecret: process.env.SESSION_SECRET || 'I Am A Monkey',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  stripeSecret: process.env.STRIPE_SECRET
};
