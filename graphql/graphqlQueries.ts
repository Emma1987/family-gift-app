import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
    mutation registerMutation($input: CreateUserInput!) {
        register(input: $input) {
            jwt {
                token
                refreshToken
                refreshTokenExpiration
            }
        }
    }
`;
