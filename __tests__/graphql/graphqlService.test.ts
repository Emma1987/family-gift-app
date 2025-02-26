import * as SecureStore from 'expo-secure-store';
import { ApolloError } from '@apollo/client';
import apolloClient from '@/api/apolloClient';
import { register } from '@/graphql/graphqlService';
import { registerMichaelInput } from '@/__tests__/__fixtures__/fixtures';

jest.mock('expo-secure-store');
jest.mock('@/api/apolloClient');
jest.mock('@/graphql/graphqlQueries', () => ({
    REGISTER_MUTATION: jest.fn(),
}));

describe('register function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully register and store tokens', async () => {
        const mockJwt = {
            token: 'mockJwtToken',
            refresh_token: 'mockRefreshToken',
            refresh_token_expiration: 123456789,
        };
        apolloClient.mutate.mockResolvedValue({
            data: {
                register: {
                    jwt: mockJwt,
                },
            },
        });

        SecureStore.setItemAsync.mockResolvedValue(undefined);

        const response = await register(registerMichaelInput);

        expect(response).toEqual(mockJwt);
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('authToken', 'mockJwtToken');
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'mockRefreshToken');
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshTokenExpiration', '123456789');
    });

    it('should throw an error when registration fails (no data.register)', async () => {
        apolloClient.mutate.mockResolvedValue({ data: {} });

        await expect(register(registerMichaelInput)).rejects.toThrow(
            "Registration failed: can't find data.register"
        );
    });

    it('should throw ApolloError for validation violations', async () => {
        const validationError = {
            violations: [
                { propertyPath: 'email', message: 'This email is already used.' },
                { propertyPath: 'password', message: 'Password is too short.' },
            ],
        };
        const error = new ApolloError({
            graphQLErrors: [new Error('Validation failed')],
            extraInfo: validationError, // Make sure this is properly set
        });

        apolloClient.mutate.mockRejectedValue(error);

        await expect(register(registerMichaelInput)).rejects.toEqual(validationError);
    });

    it('should throw an unknown error if an unexpected error occurs', async () => {
        const error = new Error();
        apolloClient.mutate.mockRejectedValue(error);

        await expect(register(registerMichaelInput)).rejects.toThrow('Registration failed: Unknown error');
    });
});
