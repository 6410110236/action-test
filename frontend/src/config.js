const isProd = process.env.NODE_ENV === 'production'

const config = {
  isProd,
  serverUrlPrefix: isProd ? 'https://wd22.cloud-workshop.online/api' : 'http://localhost:1337/api' //*****change domain name
}

export default config;
