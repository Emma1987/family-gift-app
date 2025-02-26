import { AvatarFullConfig } from '@zamplyy/react-native-nice-avatar';

export type FamilyMemberType = {
    id: string;
    name?: string;
};

export type LoginInput = {
    username: string;
    password: string;
};

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
    familyCode?: string | null;
    familyName?: string | null;
    avatar: AvatarFullConfig;
};

export type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    selectedChoice: FamilyChoiceEnum;
    familyCode: string | undefined;
    familyName: string | undefined;
    avatarConfig: AvatarFullConfig;
};

export type AuthResponse = {
    token: string;
    refresh_token: string;
    refresh_token_expiration: number;
};

export type ValidationViolation = {
    field: string;
    messages: string[];
};

export enum FamilyChoiceEnum {
    JOIN = 'join-family',
    CREATE = 'create-family',
}
