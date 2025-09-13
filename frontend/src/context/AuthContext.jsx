import {createContext, useContext, useEffect, useState} from "react";
import styled from "styled-components";
import { getApiEndpoint } from '../utils/apiConfig';
import { getCookie, setCookie, deleteAllAuthCookies } from '../utils/cookieUtils';

const LoadingWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    
    @media (prefers-color-scheme: dark) {
        background: #0f172a;
    }
`;

const LoadingContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    
    @media (prefers-color-scheme: dark) {
        background: #1e293b;
        border: 1px solid #334155;
        color: #f1f5f9;
    }
`;

const Spinner = styled.div`
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-radius: 50%;
    border-top-color: #2563eb;
    animation: spin 1s ease-in-out infinite;
    
    @media (prefers-color-scheme: dark) {
        border-color: #334155;
        border-top-color: #3b82f6;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);

    const getTokenFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            jwt: urlParams.get('token'),
            github_token: urlParams.get('github_token')
        };
    };

    const getTokenFromCookie = () => {
        return getCookie('jwt');
    };

    const setTokens = (jwt, githubToken) => {
        if (jwt) {
            setCookie('jwt', jwt, 7);
        }
        if (githubToken) {
            setCookie('github_token', githubToken, 7);
        }

        // URL에서 토큰 파라미터 제거
        const url = new URL(window.location);
        url.searchParams.delete('token');
        url.searchParams.delete('github_token');
        window.history.replaceState({}, document.title, url.toString());
    };

    const removeTokens = () => {
        deleteAllAuthCookies();
    };

    const validateTokenWithServer = async (token) => {
        try {
            const response = await fetch(getApiEndpoint('/auth/token'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                },
                body: `token=${encodeURIComponent(token)}`
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.valid) {
                    setUser({
                        username: data.username,
                        email: data.email
                    });
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    };

    const checkAuthStatus = async () => {
        const urlTokens = getTokenFromUrl();
        let jwtToken = urlTokens.jwt;

        if (jwtToken) {
            setTokens(jwtToken, urlTokens.github_token);
        } else {
            jwtToken = getTokenFromCookie();
        }

        if (jwtToken) {
            const isValid = await validateTokenWithServer(jwtToken);
            if (isValid) {
                setIsAuthenticated(true);
            } else {
                removeTokens();
                setIsAuthenticated(false);
                setUser(null);
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    const logout = () => {
        removeTokens();
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    if (isAuthenticated === null) {
        return (
            <LoadingWrapper>
                <LoadingContent>
                    <Spinner />
                    <p>인증 상태를 확인하고 있습니다...</p>
                </LoadingContent>
            </LoadingWrapper>
        );
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            logout,
            token: getTokenFromCookie()
        }}>
            {children}
        </AuthContext.Provider>
    );
};