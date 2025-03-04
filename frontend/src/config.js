const isProd = process.env.NODE_ENV === 'production'

const config = {
  isProd,
  serverUrlPrefix: isProd ? 'https://w07-admin.pupasoft.com' : 'http://localhost:1337/api', //*****change domain name
  STRIPE_PUBLISHABLE_KEY : process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY : process.env.REACT_APP_STRIPE_SECRET_KEY,
  STRIPE_SUCCESS_URL : process.env.REACT_APP_STRIPE_SUCCESS_URL,
  STRIPE_CANCEL_URL : process.env.REACT_APP_STRIPE_CANCEL_URL
}

export default config;
