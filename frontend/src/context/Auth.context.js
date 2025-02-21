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
    
        if (error) {
            setLoginError(error);
            setLoginSuccess(false, null, null, null);
            setState({
                isLoggedIn: false,
                user: null,
                jwt: null,
                role: null,
                loginError: error
            });
            console.error('Login error:', error);
            return;
        }
    
        if (result?.user && result?.jwt) {
            const userRole = result.user.role;
            console.log('Login successful, user role:', userRole);
            updateJwt(result.jwt, userRole, rememberMe);
            setState({
                isLoggedIn: true,
                user: { ...result.user, role: userRole },
                jwt: result.jwt,
                loginError: null
            });
        } else {
            setLoginError(new Error('Invalid login response'));
            setState({
                isLoggedIn: false,
                user: null,
                jwt: null,
                role: null,
                loginError: new Error('Invalid login response')
            });
        }
    }

    const loadPersistedJwt = async (callback) => {
        try {
            const persistedJwt = sessionStorage.getItem(conf.jwtSessionStorageKey) || localStorage.getItem(conf.jwtSessionStorageKey);
            const persistedRole = sessionStorage.getItem(conf.roleSessionStorageKey) || localStorage.getItem(conf.roleSessionStorageKey);
            
            if (!persistedJwt) {
                setLoginPending(false);
                callback(null);
                return;
            }

            axData.jwt = persistedJwt;
            try {
                const response = await ax.get(conf.jwtUserEndpoint);
                console.log('Response from /api/users/me:', response);
                if (response.data.id > 0) {
                    const userRole = response.data.role ? response.data.role.type : persistedRole;
                    callback(null, { user: response.data, jwt: persistedJwt, role: userRole });
                    console.log('Auto login successful:', response.data);
                } else {
                    setLoginPending(false);
                    callback(null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoginPending(false);
                callback(new Error('Failed to fetch user data'));
            }
        } catch (e) {
            console.log(e);
            setLoginPending(false);
            callback(new Error('Failed to initiate auto login'));
        }
    };

    useEffect(() => {
        setLoginPending(true);
        loadPersistedJwt(handleLoginResult);
    }, []);

    const login = (username, password, rememberMe) => {
        return new Promise((resolve) => {
            setLoginPending(true);
            setLoginSuccess(false);
            setLoginError(null);
    
            fetchLogin(username, password, (error, result) => {
                handleLoginResult(error, result, rememberMe);
                if (error) {
                    resolve({ error });
                } else {
                    resolve({ success: true });
                }
            });
        });
    };

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
        console.log('Attempting login to:', `${conf.apiUrlPrefix}${conf.loginEndpoint}`);
        const response = await ax.post(conf.loginEndpoint, {
            identifier: username,
            password
        });
        if (response.data?.jwt && response.data?.user?.id > 0) {
            callback(null, response.data);
        } else {
            callback(new Error('Invalid response format'));
        }
    } catch (e) {
        console.error('Login error details:', {
            status: e.response?.status,
            message: e.message,
            endpoint: `${conf.apiUrlPrefix}${conf.loginEndpoint}`
        });
        if (e.response?.status === 404) {
            callback(new Error('Login service not found. Please check API configuration'));
        } else if (e.response?.status === 400) {
            callback(new Error('Invalid username or password'));
        } else {
            callback(new Error(`Login failed: ${e.message}`));
        }
    }
};