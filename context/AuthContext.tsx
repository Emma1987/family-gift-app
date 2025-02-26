import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

import { login as loginService, logout as logoutService } from '@/api/authService';
import { checkAuthStatus } from '@/helpers/authHelper';
import { AuthResponse, LoginInput } from '@/types/types';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (loginInput: LoginInput) => Promise<AuthResponse | void>;
    logout: () => Promise<void>;
    setIsAuthenticatedContext: (value: boolean) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuthStatus(setIsAuthenticated, setLoading);
    }, []);

    const { mutateAsync: login } = useMutation({
        mutationFn: async (loginInput: LoginInput) => {
            try {
                const response = await loginService(loginInput);
                setIsAuthenticated(true);

                return response;
            } catch (err: any) {
                setIsAuthenticated(false);
                throw err;
            }
        },
    });

    const logout = async () => {
        await logoutService();
        setIsAuthenticated(false);
    };

    const setIsAuthenticatedContext = (value: boolean) => {
        setIsAuthenticated(value);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, setIsAuthenticatedContext, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
