import * as SecureStore from 'expo-secure-store';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { refreshToken, logout } from '@/api/authService';

export const isJWTExpired = (token: string | null): boolean => {
    if (!token) {
        return true;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp === undefined) {
            return false;
        }

        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.error('Error while checking JWT validity:', error);
        return true;
    }
};

export const checkAuthStatus = async (
    setIsAuthenticated: (value: boolean) => void,
    setLoading: (value: boolean) => void,
) => {
    setLoading(true);

    let authToken = await SecureStore.getItemAsync('authToken');
    let isExpired = isJWTExpired(authToken);

    if (authToken && !isExpired) {
        setIsAuthenticated(true);
    } else if (!authToken || isExpired) {
        authToken = await refreshToken();
        setIsAuthenticated(!!authToken);
    } else {
        await logout();
        setIsAuthenticated(false);
    }

    setLoading(false);
};
