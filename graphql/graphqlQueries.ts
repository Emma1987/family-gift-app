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

export const ME_QUERY = gql`
    query meQuery {
        me {
            id
            email
            isAdmin
            name
            avatar
            family {
                name
                familyCode
            }
            familyMembers {
                name
                avatar
            }
        }
    }
`;
