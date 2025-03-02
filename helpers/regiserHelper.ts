import { FamilyChoiceEnum, RegisterFormData, RegisterInput } from '@/types/appTypes';

export const getRegisterInput = (formData: RegisterFormData): RegisterInput => {
    return {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatarConfig,
        familyCode: formData.selectedChoice === FamilyChoiceEnum.JOIN ? formData.familyCode : null,
        familyName: formData.selectedChoice === FamilyChoiceEnum.CREATE ? formData.familyName : null,
    };
};
