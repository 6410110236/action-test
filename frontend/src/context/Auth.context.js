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
    jwt: null, // Add jwt to the initial state
};

const updateJwt = (jwt, rememberMe) => {
    axData.jwt = jwt;
    if (jwt) {
        if (rememberMe) {
            localStorage.setItem(conf.jwtSessionStorageKey, jwt);
            console.log('JWT stored in localStorage');
        } else {
            sessionStorage.setItem(conf.jwtSessionStorageKey, jwt);
            console.log('JWT stored in sessionStorage');
        }
    } else {
        localStorage.removeItem(conf.jwtSessionStorageKey);
        sessionStorage.removeItem(conf.jwtSessionStorageKey);
        console.log('JWT removed from storage');
    }
};

export const ContextProvider = props => {
    const [state, setState] = useSetState(initialState);

    const setLoginPending = (isLoginPending) => setState({ isLoginPending });
    const setLoginSuccess = (isLoggedIn, user, jwt) => setState({ isLoggedIn, user, jwt }); // Pass jwt to setLoginSuccess
    const setLoginError = (loginError) => setState({ loginError });


    const handleLoginResult = (error, result, rememberMe) => {
        setLoginPending(false);

        if (result && result.user) {
            if (result.jwt) {
                updateJwt(result.jwt, rememberMe);
                setLoginSuccess(true, result.user, result.jwt); // Pass jwt to setLoginSuccess
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
        if (persistedJwt) {
            axData.jwt = persistedJwt;
            const response = await ax.get(conf.jwtUserEndpoint);
            if (response.data.id > 0) {
                callback(null, { user: response.data });
            } else {
                callback(null);
            }
        }
    } catch (e) {
        console.log(e);
        callback(new Error('Fail to initiate auto login'));
    }
};