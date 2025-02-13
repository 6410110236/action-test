const conf = {
    apiUrlPrefix: process.env.REACT_APP_API_URL,
    loginEndpoint: '/api/auth/local',
    jwtUserEndpoint: '/api/users/me',
    jwtSessionStorageKey: 'auth.jwt'
};

export default conf;