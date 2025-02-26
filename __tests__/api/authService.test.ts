import mockAxios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { login, refreshToken, logout } from '@/api/authService';
import { AuthResponse, LoginInput } from '@/types/types';

jest.mock('expo-secure-store');

describe('authService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        const mockLoginInput: LoginInput = { username: 'test@example.com', password: 'password123' };
        const mockAuthResponse: AuthResponse = {
            token: 'newAuthToken',
            refresh_token: 'newRefreshToken',
            refresh_token_expiration: 9999999999,
        };

        it('stores tokens on successful login', async () => {
            mockAxios.post.mockResolvedValue({ data: mockAuthResponse });

            await login(mockLoginInput);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('authToken', 'newAuthToken');
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'newRefreshToken');
        });

        it('throws an error if login fails', async () => {
            mockAxios.post.mockRejectedValue({ response: { data: { message: 'Login failed' } } });
            await expect(login(mockLoginInput)).rejects.toEqual({ message: 'Login failed' });
        });
    });

    describe('refreshToken', () => {
        const mockAuthResponse: AuthResponse = {
            token: 'newAuthToken',
            refresh_token: 'newRefreshToken',
            refresh_token_expiration: 9999999999,
        };

        beforeEach(() => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('validRefreshToken');
            mockAxios.post.mockResolvedValue({ data: mockAuthResponse });
        });

        it('refreshes token successfully', async () => {
            const newToken = await refreshToken();
            expect(newToken).toBe('newAuthToken');
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('authToken', 'newAuthToken');
        });

        it('returns null if no refresh token is found', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
            await expect(refreshToken()).resolves.toBeNull();
        });

        it('logs out on refresh failure', async () => {
            mockAxios.post.mockRejectedValue(new Error('Refresh failed'));
            await refreshToken();
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('authToken');
        });
    });

    describe('logout', () => {
        it('clears stored authentication data', async () => {
            await logout();
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('authToken');
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshTokenExpiration');
        });
    });   
});
