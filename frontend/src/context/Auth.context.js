import React, { useEffect } from 'react';
import { useSetState } from 'react-use';
import conf from '../conf/main'
import ax, { axData } from '../conf/ax'

export const AuthContext = React.createContext(null);

const initialState = {
    isLoggedIn: false,
    user: null,
    isLoginPending: false,
    loginError: null,
    jwt: null,
    role: null, // Add role to the initial state
};

const updateJwt = (jwt, role, rememberMe) => {
    axData.jwt = jwt;
    if (jwt) {
        if (rememberMe) {
            localStorage.setItem(conf.jwtSessionStorageKey, jwt);
            localStorage.setItem(conf.roleSessionStorageKey, role); // Store role in localStorage
            console.log('JWT and role stored in localStorage');
        } else {
            sessionStorage.setItem(conf.jwtSessionStorageKey, jwt);
            sessionStorage.setItem(conf.roleSessionStorageKey, role); // Store role in sessionStorage
            console.log('JWT and role stored in sessionStorage');
        }
    } else {
        localStorage.removeItem(conf.jwtSessionStorageKey);
        localStorage.removeItem(conf.roleSessionStorageKey); // Remove role from localStorage
        sessionStorage.removeItem(conf.jwtSessionStorageKey);
        sessionStorage.removeItem(conf.roleSessionStorageKey); // Remove role from sessionStorage
        console.log('JWT and role removed from storage');
    }
};

export const ContextProvider = props => {
    const [state, setState] = useSetState(initialState);

    const setLoginPending = (isLoginPending) => setState({ isLoginPending });
    const setLoginSuccess = (isLoggedIn, user, jwt, role) => setState({ isLoggedIn, user, jwt, role }); // Pass role to setLoginSuccess
    const setLoginError = (loginError) => setState({ loginError });

    const handleLoginResult = (error, result, rememberMe) => {
        setLoginPending(false);
    
        if (result && result.user) {
            if (result.jwt) {
                updateJwt(result.jwt, result.user.role, rememberMe); // Pass role to updateJwt
                setLoginSuccess(true, result.user, result.jwt, result.user.role); // Pass role to setLoginSuccess
            }
            console.log('Login successful:', result.user);
        } else if (error) {
            setLoginError(error);
            console.error('Login error:', error);
        }
    }

    useEffect(() => {
        setLoginPending(true)
        loadPersistedJwt(handleLoginResult)
    }, [])

    const login = (username, password, rememberMe) => {
        setLoginPending(true);
        setLoginSuccess(false);
        setLoginError(null);

        fetchLogin(username, password, (error, result) => handleLoginResult(error, result, rememberMe))
    }

    const logout = () => {
        setLoginPending(false);
        updateJwt(null)
        setLoginSuccess(false);
        setLoginError(null);
        console.log('Logged out');
    }

    return (
        <AuthContext.Provider
        value={{
            state,
            login,
            logout,
        }}
        >
        {props.children}
        </AuthContext.Provider>
    );
};

const fetchLogin = async (username, password, callback) => {
    try {
        const response = await ax.post(conf.loginEndpoint, {
        identifier: username,
        password
        })
        if (response.data.jwt && response.data.user.id > 0) {
        callback(null, response.data)
        } else {
        callback(new Error('Invalid username and password'))
        }
    } catch (e) {
        callback(new Error('Fail to initiate login'))
    }
}

const loadPersistedJwt = async (callback) => {
    try {
        const persistedJwt = sessionStorage.getItem(conf.jwtSessionStorageKey) || localStorage.getItem(conf.jwtSessionStorageKey);
        const persistedRole = sessionStorage.getItem(conf.roleSessionStorageKey) || localStorage.getItem(conf.roleSessionStorageKey); // Load role from storage
        if (persistedJwt) {
            axData.jwt = persistedJwt;
            try {
                const response = await ax.get(conf.jwtUserEndpoint);
                console.log('Response from /api/users/me:', response); // Log the response
                if (response.data.id > 0) {
                    const userRole = response.data.role ? response.data.role.type : persistedRole;
                    callback(null, { user: response.data, jwt: persistedJwt, role: userRole }); // Pass role to callback
                    console.log('Auto login successful:', response.data);
                } else {
                    callback(null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                callback(new Error('Fail to fetch user data'));
            }
        } else {
            callback(null);
        }
    } catch (e) {
        console.log(e);
        callback(new Error('Fail to initiate auto login'));
    }
};