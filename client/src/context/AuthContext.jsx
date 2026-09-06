import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('collabboard_user');
            return saved ? JSON.parse(saved) : null;
        } catch (err) {
            console.error('Error loading user from localStorage:', err);
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem('collabboard_token') || null;
        } catch (err) {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (token) {
                localStorage.setItem('collabboard_token', token);
            } else {
                localStorage.removeItem('collabboard_token');
            }

            if (currentUser) {
                localStorage.setItem('collabboard_user', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('collabboard_user');
            }
        } catch (err) {
            console.warn('LocalStorage write failed due to quota limit. State maintained in memory.');
        }
    }, [token, currentUser]);

    const login = async (email, password) => {
        try {
            console.log('AuthProvider: Sending login request for:', email);
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });

            const responseData = response.data || {};
            const newToken = responseData.token;
            const user = responseData.user;

            if (!newToken || !user) {
                throw new Error('Server response missing token or user object.');
            }

            // CRITICAL FIX: Write to localStorage synchronously BEFORE updating state
            // This prevents race conditions where components mount before the token is saved.
            try {
                localStorage.setItem('collabboard_token', newToken);
                localStorage.setItem('collabboard_user', JSON.stringify(user));
            } catch (e) {
                console.warn('Immediate localStorage write failed, relying on state effect.');
            }

            setToken(newToken);
            setCurrentUser(user);
            console.log('AuthProvider: State updated successfully with logged-in user.');
            return user;
        } catch (err) {
            console.error('AuthProvider: Login caught an error:', err);
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === 'string' ? err.response.data.replace(/^["']+|["']+$/g, '') : null) ||
                err.message ||
                'Login failed.';
            throw new Error(errorMsg);
        }
    };

    const register = async (nameOrData, email, password, role, jobTitle, department) => {
        try {
            let payload = nameOrData;
            if (typeof nameOrData === 'string') {
                payload = {
                    name: nameOrData,
                    email,
                    password,
                    role: role || 'employee',
                    jobTitle: jobTitle || '',
                    department: department || ''
                };
            }

            console.log('AuthProvider: Sending registration payload:', payload);
            const response = await apiClient.post('/auth/register', payload);

            const responseData = response.data || {};
            const newToken = responseData.token;
            const user = responseData.user || responseData;

            if (!newToken || !user) {
                throw new Error('Server response missing token or user object.');
            }

            try {
                localStorage.setItem('collabboard_token', newToken);
                localStorage.setItem('collabboard_user', JSON.stringify(user));
            } catch (e) {
                // Ignore quota warnings
            }

            setToken(newToken);
            setCurrentUser(user);
            console.log('AuthProvider: Registration successful.');
            return user;
        } catch (err) {
            console.error('AuthProvider: Register error:', err);
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === 'string' ? err.response.data.replace(/^["']+|["']+$/g, '') : null) ||
                err.message ||
                'Registration failed.';
            throw new Error(errorMsg);
        }
    };

    const logout = () => {
        console.log('AuthProvider: Logging out user...');
        setToken(null);
        setCurrentUser(null);
        try {
            localStorage.removeItem('collabboard_token');
            localStorage.removeItem('collabboard_user');
        } catch (err) {
            // Ignore
        }
    };

    const value = {
        currentUser,
        token,
        isAdmin: currentUser?.role === 'admin' || currentUser?.role === 'manager',
        login,
        register,
        logout,
        setCurrentUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;