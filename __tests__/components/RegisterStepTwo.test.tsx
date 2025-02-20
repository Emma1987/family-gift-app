import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { RegisterStepTwo } from '@/components/RegisterStepTwo';

describe('RegisterStepTwo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const methods = useForm();
        return <FormProvider {...methods}>{children}</FormProvider>;
    };

    it('renders all input fields', () => {
        const { getByLabelText, getByText } = render(
            <Wrapper>
                <RegisterStepTwo nextStep={jest.fn()} prevStep={jest.fn()} />
            </Wrapper>
        );

        expect(getByText('Étape 2 : Famille')).toBeTruthy();
        expect(getByLabelText('Rejoindre ma famille grâce au code famille')).toBeTruthy();
        expect(getByLabelText('Créer une nouvelle famille')).toBeTruthy();
        
        expect(getByText('Précédent')).toBeTruthy();
        expect(getByText('Suivant')).toBeTruthy();
    });

    it('displays the familyCode input when "join-family" is selected', async () => {
        const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
            <Wrapper>
                <RegisterStepTwo nextStep={jest.fn()} prevStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.press(getByText('Rejoindre ma famille grâce au code famille'));

        await waitFor(() => {
            expect(getByPlaceholderText('Code famille')).toBeTruthy();
            expect(queryByPlaceholderText('Nom de la famille')).not.toBeTruthy();
        });
    });

    it('displays the familyName input when "create-family" is selected', async () => {
        const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
            <Wrapper>
                <RegisterStepTwo nextStep={jest.fn()} prevStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.press(getByText('Créer une nouvelle famille'));

        await waitFor(() => {
            expect(queryByPlaceholderText('Code famille')).not.toBeTruthy();
            expect(getByPlaceholderText('Nom de la famille')).toBeTruthy();
        });
    });

    it('shows an error when "Suivant" is clicked without filling required fields', async () => {
        const { getByText, findByText } = render(
            <Wrapper>
                <RegisterStepTwo nextStep={jest.fn()} prevStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.press(getByText('Rejoindre ma famille grâce au code famille'));
        fireEvent.press(getByText('Suivant'));

        expect(await findByText('Le code famille est obligatoire')).toBeTruthy();

        fireEvent.press(getByText('Créer une nouvelle famille'));
        fireEvent.press(getByText('Suivant'));

        expect(await findByText('Un nom pour créer la famille est obligatoire.')).toBeTruthy();
    });

    it('calls nextStep when valid input is provided', async () => {
        const mockNextStep = jest.fn();

        const { getByText, getByPlaceholderText } = render(
            <Wrapper>
                <RegisterStepTwo nextStep={mockNextStep} prevStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.press(getByText('Créer une nouvelle famille'));

        const familyNameInput = getByPlaceholderText('Nom de la famille');
        fireEvent.changeText(familyNameInput, 'Ma Famille');

        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(mockNextStep).toHaveBeenCalledTimes(1);
        });
    });

    it('calls prevStep when "Précédent" button is clicked', () => {
        const mockPrevStep = jest.fn();

        const { getByText } = render(
            <Wrapper>
                <RegisterStepTwo nextStep={jest.fn()} prevStep={mockPrevStep} />
            </Wrapper>
        );

        fireEvent.press(getByText('Précédent'));
        expect(mockPrevStep).toHaveBeenCalledTimes(1);
    });

    it('matches the snapshot', () => {
        const tree = render(
            <Wrapper>
                <RegisterStepTwo nextStep={jest.fn()} prevStep={jest.fn()} />
            </Wrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
