const conf = {
    apiUrlPrefix: process.env.REACT_APP_API_URL || 'http://localhost:1337', // Add default API URL
    loginEndpoint: '/api/auth/local', // Verify this endpoint matches your backend
    jwtUserEndpoint: '/api/users/me?populate=*',
    jwtSessionStorageKey: 'auth.jwt',
    roleSessionStorageKey: 'auth.role'
};

export default conf;