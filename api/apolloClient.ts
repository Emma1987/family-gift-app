import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    HttpLink,
    from,
    fromPromise,
    NextLink,
    Operation,
    fromError,
    ApolloError,
    ServerError,
} from '@apollo/client';
import { Observable } from '@apollo/client/utilities';
import * as SecureStore from 'expo-secure-store';
import { onError } from '@apollo/client/link/error';
import { refreshToken } from '@/api/authService';

const API_URL = process.env.EXPO_PUBLIC_ME_URL;
const REGISTER_URL = process.env.EXPO_PUBLIC_REGISTER_URL;

// Create an Apollo Link for attaching the Authorization header
const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
    return fromPromise(SecureStore.getItemAsync('authToken')).flatMap((token) => {
        if (token) {
            operation.setContext(({ headers = {} }) => ({
                headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                },
            }));
        }
        return forward(operation) ?? Observable.of();
    });
});

// Modify the request URL dynamically based on mutation name
const urlLink = new ApolloLink((operation: Operation, forward: NextLink) => {
    if (operation.operationName === 'registerMutation') {
        operation.setContext({
            uri: REGISTER_URL, // Override URL for register mutation
        });
    } else {
        operation.setContext({
            uri: API_URL, // Default API URL
        });
    }
    return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let error of graphQLErrors) {
            // "validation" error
            if (error.extensions?.validation) {
                const validationError = new ApolloError({
                    errorMessage: 'Validation failed',
                    extraInfo: {
                        violations: Object.entries(error.extensions.validation).map(([field, messages]) => ({
                            field: field.replace('input.', ''),
                            messages: messages.map((msg: { message: string }) => msg.message),
                        })),
                    },
                });

                return fromError(validationError);
            }
        }
    }

    if (networkError) {
        // "unauthenticated" error
        if (
            (networkError as ServerError).response &&
            (networkError as ServerError).response.status &&
            (networkError as ServerError).response.status === 401
        ) {
            return fromPromise(
                refreshToken().then((newToken) => {
                    if (!newToken) throw new Error('Token refresh failed');

                    operation.setContext(({ headers = {} }) => ({
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${newToken}`,
                        },
                    }));

                    return forward(operation);
                }),
            ).flatMap((observable) => observable);
        } else {
            console.error('Network error:', networkError);
        }
    }
});

const httpLink = new HttpLink({ uri: API_URL });

const apolloClient = new ApolloClient({
    link: from([authLink, urlLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
});

export default apolloClient;
