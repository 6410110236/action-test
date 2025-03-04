const isProd = process.env.NODE_ENV === 'production'

const config = {
  isProd,
  serverUrlPrefix: isProd ? 'https://w07-admin.pupasoft.com' : 'http://localhost:1337/api' //*****change domain name
}

export default config;
