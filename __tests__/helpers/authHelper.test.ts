import * as SecureStore from 'expo-secure-store';
import { isJWTExpired, checkAuthStatus } from '@/helpers/authHelper';
import { refreshToken } from '@/api/authService';

jest.mock('expo-secure-store');
jest.mock('jwt-decode', () => ({
    ...jest.requireActual('@/api/authService'),
    jwtDecode: (jwt: any) => jwt.exp !== undefined ? jwt : undefined,
}));
jest.mock('@/api/authService', () => ({
    ...jest.requireActual('@/api/authService'),
    refreshToken: jest.fn().mockResolvedValue('newAuthToken'),
}));

const mockSetIsAuthenticated = jest.fn();
const mockSetLoading = jest.fn();

describe('authHelper', () => {
    describe('isJWTExpired', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('returns true if token is null', () => {
            expect(isJWTExpired(null)).toBe(true);
        });

        it('returns true if token is expired', () => {
            expect(isJWTExpired({exp: Math.floor(Date.now() / 1000) - 10})).toBe(true);
        });

        it('returns false if token is valid', () => {
            expect(isJWTExpired({exp: Math.floor(Date.now() / 1000) + 3600})).toBe(false);
        });

        it('returns true if token is malformed', () => {
            expect(isJWTExpired('invalidToken')).toBe(true);
        });
    });

    describe('checkAuthStatus', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('authenticates user if token is valid', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue({exp: Math.floor(Date.now() / 1000) + 3600});
    
            await checkAuthStatus(mockSetIsAuthenticated, mockSetLoading);
    
            expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
        });

        it('attempts to refresh if token is expired', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce({exp: Math.floor(Date.now() / 1000) - 10});

            await checkAuthStatus(mockSetIsAuthenticated, mockSetLoading);

            expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
        });

        it('logs out if both tokens are invalid', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce({exp: Math.floor(Date.now() / 1000) - 10});
            (refreshToken as jest.Mock).mockResolvedValue(null);
    
            await checkAuthStatus(mockSetIsAuthenticated, mockSetLoading);
    
            expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
        });
    });
});
