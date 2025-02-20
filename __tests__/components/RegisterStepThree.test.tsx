import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { RegisterStepThree } from '@/components/RegisterStepThree';

jest.mock('@/components/AvatarCustomizer', () => {
    const React = require('react');
    const { View, Text } = require('react-native');

    return {
        AvatarCustomizer: () => (
            <View>
                <Text>Final avatar</Text>
            </View>
        ),
    };
});

describe('RegisterStepThree', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const methods = useForm();
        return <FormProvider {...methods}>{children}</FormProvider>;
    };

    it('renders correctly', () => {
        const { getByText } = render(
            <Wrapper>
                <RegisterStepThree handleSubmit={jest.fn()} prevStep={jest.fn()} />
            </Wrapper>
        );

        expect(getByText('Étape 3 : Avatar')).toBeTruthy();
        expect(getByText('Final avatar')).toBeTruthy();
        expect(getByText('Précédent')).toBeTruthy();
        expect(getByText('Créer')).toBeTruthy();
    });

    it('calls prevStep when clicking "Précedent"', () => {
        const mockPrevStep = jest.fn();

        const { getByText } = render(
            <Wrapper>
                <RegisterStepThree handleSubmit={jest.fn()} prevStep={mockPrevStep} />
            </Wrapper>
        );

        fireEvent.press(getByText('Précédent'));
        expect(mockPrevStep).toHaveBeenCalledTimes(1);
    });

    it('calls handleSubmit when clicking "Créer"', async () => {
        const mockHandleSubmit = jest.fn();
        
        const { getByText } = render(
            <Wrapper>
                <RegisterStepThree handleSubmit={mockHandleSubmit} prevStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.press(getByText('Créer'));
        
        await waitFor(() => {
            expect(mockHandleSubmit).toHaveBeenCalled();
        });
    });

    it('matches the snapshot', () => {
        const tree = render(
            <Wrapper>
                <RegisterStepThree handleSubmit={jest.fn()} prevStep={jest.fn()} />
            </Wrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
