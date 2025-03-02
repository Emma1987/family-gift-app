import { getRegisterInput } from '@/helpers/regiserHelper';
import { FamilyChoiceEnum, RegisterFormData, RegisterInput } from '@/types/appTypes';

describe('regiserHelper', () => {
    it('should map RegisterFormData to RegisterInput when joining a family', () => {
        const formData: RegisterFormData = {
            name: 'Laurie',
            email: 'laurie@strode.com',
            password: 'Strode1961',
            avatarConfig: {},
            selectedChoice: FamilyChoiceEnum.JOIN,
            familyCode: 'FAMHAL',
            familyName: 'The Halloween family',
        };

        const expected: RegisterInput = {
            name: 'Laurie',
            email: 'laurie@strode.com',
            password: 'Strode1961',
            avatar: {},
            familyCode: 'FAMHAL',
            familyName: null,
        };

        expect(getRegisterInput(formData)).toEqual(expected);
    });

    it('should map RegisterFormData to RegisterInput when creating a family', () => {
        const formData: RegisterFormData = {
            name: 'Tommy',
            email: 'tommy@doyle.com',
            password: 'TommyDoyle70',
            avatarConfig: {},
            selectedChoice: FamilyChoiceEnum.CREATE,
            familyCode: 'SHOULD_BE_NULL',
            familyName: 'The Halloween family',
        };

        const expected: RegisterInput = {
            name: 'Tommy',
            email: 'tommy@doyle.com',
            password: 'TommyDoyle70',
            avatar: {},
            familyCode: null,
            familyName: 'The Halloween family',
        };

        expect(getRegisterInput(formData)).toEqual(expected);
    });
});
