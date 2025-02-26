import * as SecureStore from 'expo-secure-store';
import apolloClient from '@/api/apolloClient';
import { REGISTER_MUTATION } from '@/graphql/graphqlQueries';
import { AuthResponse, RegisterInput } from '@/types/types';
import { ApolloError } from '@apollo/client';

export const register = async (registerInput: RegisterInput): Promise<AuthResponse> => {
    try {
        const { data } = await apolloClient.mutate({
            mutation: REGISTER_MUTATION,
            variables: { input: registerInput },
        });

        if (data && data.register) {
            const jwt = data.register.jwt;
            await SecureStore.setItemAsync('authToken', jwt.token);
            await SecureStore.setItemAsync('refreshToken', jwt.refresh_token);
            await SecureStore.setItemAsync('refreshTokenExpiration', jwt.refresh_token_expiration.toString());

            return data.register.jwt;
        }

        throw new Error("Registration failed: can't find data.register");
    } catch (error: any) {
        console.error('Unexpected Registration error:', error);

        if (error instanceof ApolloError) {
            if (error.extraInfo?.violations) {
                throw error.extraInfo;
            }
            throw new Error(`GraphQL Error: ${error.message}`);
        }

        throw new Error(`Registration failed: ${error.message || 'Unknown error'}`);
    }
};
