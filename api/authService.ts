import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse, LoginInput } from '@/types/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const LOGIN_PATH = '/login';
const REFRESH_TOKEN_PATH = '/token/refresh';

const api = axios.create({ baseURL: API_URL });

// Login request (Axios)
export const login = async (loginInput: LoginInput) => {
    try {
        const { data } = await api.post<AuthResponse>(`${LOGIN_PATH}`, loginInput, {
            headers: { 'Content-Type': 'application/json' },
        });

        await SecureStore.setItemAsync('authToken', data.token);
        await SecureStore.setItemAsync('refreshToken', data.refresh_token);
        await SecureStore.setItemAsync('refreshTokenExpiration', data.refresh_token_expiration.toString());

        return data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

// Refresh token request (Axios)
export const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshToken = await SecureStore.getItemAsync('authToken');

        if (!refreshToken) {
            console.warn('No refresh token found');
            return null;
        }

        const { data } = await axios.post<AuthResponse>(
            `${REFRESH_TOKEN_PATH}`,
            new URLSearchParams({ refresh_token: refreshToken }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        );

        await SecureStore.setItemAsync('authToken', data.token);
        await SecureStore.setItemAsync('refreshToken', data.refresh_token);
        await SecureStore.setItemAsync('refreshTokenExpiration', data.refresh_token_expiration.toString());

        return data.token;
    } catch (error) {
        console.error('Token refresh failed:', error);

        await logout();
        return null;
    }
};

export const logout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('refreshTokenExpiration');
};
