const conf = {
    apiUrlPrefix: process.env.REACT_APP_API_URL || 'http://localhost:1337/api',
    loginEndpoint: '/auth/local',
    jwtUserEndpoint: '/users/me',
    jwtSessionStorageKey: 'auth.jwt'
};

export default conf;