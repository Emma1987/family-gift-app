import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';

import { RegisterStepOne } from '@/components/RegisterStepOne';

describe('RegisterStepOne', () => {
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
                <RegisterStepOne nextStep={jest.fn()} />
            </Wrapper>
        );

        expect(getByText('Étape 1 : Informations')).toBeTruthy();
        expect(getByLabelText('Nom')).toBeTruthy();
        expect(getByLabelText('Adresse email')).toBeTruthy();
        expect(getByLabelText('Mot de passe')).toBeTruthy();
        
        expect(getByText('Suivant')).toBeTruthy();
    });

    it('shows validation errors when submitting empty form', async () => {
        const { getByText } = render(
            <Wrapper>
                <RegisterStepOne nextStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Le nom est obligatoire')).toBeTruthy();
            expect(getByText("L'email est obligatoire.")).toBeTruthy();
            expect(getByText('Le mot de passe est obligatoire.')).toBeTruthy();
        });
    });

    it('shows validation error when submitting a form with a name longer than 150 characters', async () => {
        const { getByText, getByLabelText } = render(
            <Wrapper>
                <RegisterStepOne nextStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.changeText(getByLabelText('Nom'), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sollicitudin felis sed tortor lacinia, vitae pharetra magna vestibulum. Etiam vel turpis a lorem pretium accumsan.');
        fireEvent.changeText(getByLabelText('Adresse email'), 'john@example.com');
        fireEvent.changeText(getByLabelText('Mot de passe'), 'Password1');

        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Le nom ne doit pas dépasser 150 caractères')).toBeTruthy();
        });
    });

    it('shows validation error when submitting a form with an email that is not a valid email', async () => {
        const { getByText, getByLabelText } = render(
            <Wrapper>
                <RegisterStepOne nextStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.changeText(getByLabelText('Nom'), 'John Doe');
        fireEvent.changeText(getByLabelText('Adresse email'), 'john@example');
        fireEvent.changeText(getByLabelText('Mot de passe'), 'Password1');

        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText("Cet email n'est pas un email valide")).toBeTruthy();
        });
    });

    it('shows validation error when submitting a form with a password that does not meet the requirements', async () => {
        const { getByText, getByLabelText } = render(
            <Wrapper>
                <RegisterStepOne nextStep={jest.fn()} />
            </Wrapper>
        );

        fireEvent.changeText(getByLabelText('Nom'), 'John Doe');
        fireEvent.changeText(getByLabelText('Adresse email'), 'john@example.com');
        fireEvent.changeText(getByLabelText('Mot de passe'), 'johndoe');

        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText("Le mot de passe doit être composé d'au minimum 8 caractères, et comporter au moins 1 lettre majuscule, 1 lettre minuscule et 1 chiffre.")).toBeTruthy();
        });
    });

    it('calls nextStep when form is valid', async () => {
        const nextStepMock = jest.fn();

        const { getByText, getByLabelText } = render(
            <Wrapper>
                <RegisterStepOne nextStep={nextStepMock} />
            </Wrapper>
        );

        fireEvent.changeText(getByLabelText('Nom'), 'John Doe');
        fireEvent.changeText(getByLabelText('Adresse email'), 'john@example.com');
        fireEvent.changeText(getByLabelText('Mot de passe'), 'Password1');

        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(nextStepMock).toHaveBeenCalled();
        });
    });

    it('matches the snapshot', () => {
        const tree = render(
            <Wrapper>
                <RegisterStepOne nextStep={jest.fn()} />
            </Wrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
