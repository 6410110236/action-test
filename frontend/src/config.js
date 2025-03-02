const isProd = process.env.NODE_ENV === 'production'

const config = {
  isProd,
  serverUrlPrefix: isProd ? 'https://w07.pupasoft.com' : 'http://localhost:1337/api' //*****change domain name
}

export default config;
