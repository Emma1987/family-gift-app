import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import RegisterScreen from '@/app/register';
import { useAuth } from '@/context/AuthContext';
import { register as registerService } from '@/graphql/graphqlService';

const mockRouter = { replace: jest.fn(), back: jest.fn() };
const mockSetAuth = jest.fn();
const mockRegister = jest.fn();

jest.mock('expo-router', () => ({ useRouter: jest.fn() }));
jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn((options) => {
        return {
            mutateAsync: async (data) => {
                const result = await mockRegister(data);

                if (options?.onSuccess) {
                    options.onSuccess();
                }

                return result;
            },
        };
    }),
}));
jest.mock('@/context/AuthContext', () => ({ useAuth: jest.fn() }));

describe('RegisterScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue(mockRouter);
        useAuth.mockReturnValue({ setIsAuthenticatedContext: mockSetAuth });
    });

    it('renders correctly', () => {
        //useMutation.mockReturnValue({ mutateAsync: mockRegister });
        const { getByLabelText, getByText } = render(
            <RegisterScreen />
        );

        expect(getByLabelText('Logo application')).toBeTruthy();
        expect(getByText('Me connecter')).toBeTruthy();

        // Step 1 is displayed
        expect(getByText('Étape 1 : Informations')).toBeTruthy();
        expect(getByLabelText('Nom')).toBeTruthy();
        expect(getByLabelText('Adresse email')).toBeTruthy();
        expect(getByLabelText('Mot de passe')).toBeTruthy();
    });

    it('navigates between steps correctly', async () => {
        const { getByText, getByLabelText } = render(
            <RegisterScreen />
        );

        fireEvent.changeText(getByLabelText('Nom'), 'Michael');
        fireEvent.changeText(getByLabelText('Adresse email'), 'michael@myers.com');
        fireEvent.changeText(getByLabelText('Mot de passe'), 'Password1234');
        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Étape 2 : Famille')).toBeTruthy();
            expect(getByLabelText('Rejoindre ma famille grâce au code famille')).toBeTruthy();
            expect(getByLabelText('Créer une nouvelle famille')).toBeTruthy();
        });

        fireEvent.press(getByText('Précédent'));

        await waitFor(() => {
            expect(getByText('Étape 1 : Informations')).toBeTruthy();
            expect(getByLabelText('Nom')).toBeTruthy();
            expect(getByLabelText('Adresse email')).toBeTruthy();
            expect(getByLabelText('Mot de passe')).toBeTruthy();
        });
    });

    it('shows validation errors', async () => {
        const { getByText } = render(
            <RegisterScreen />
        );

        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Le nom est obligatoire')).toBeTruthy();
            expect(getByText("L'email est obligatoire.")).toBeTruthy();
            expect(getByText('Le mot de passe est obligatoire.')).toBeTruthy();
        });
    });

    it('calls registerService on valid submission', async () => {
        mockRegister.mockResolvedValueOnce({});
        const { getByText, getByLabelText, getByPlaceholderText } = render(
            <RegisterScreen />
        );

        fireEvent.changeText(getByLabelText('Nom'), 'Michael');
        fireEvent.changeText(getByLabelText('Adresse email'), 'michael@myers.com');
        fireEvent.changeText(getByLabelText('Mot de passe'), 'Password1234');
        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Étape 2 : Famille')).toBeTruthy();
        });

        fireEvent.press(getByText('Créer une nouvelle famille'));
        const familyNameInput = getByPlaceholderText('Nom de la famille');
        fireEvent.changeText(familyNameInput, 'Ma Famille');
        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Créer')).toBeTruthy();
        });

        fireEvent.press(getByText('Créer'));

        await waitFor(() => expect(mockRegister).toHaveBeenCalled());
    });

    it('handles API errors and displays messages', async () => {
        mockRegister.mockRejectedValueOnce({ violations: [{ field: 'email', messages: ['Email invalide'] }] });
        const { getByText, getByLabelText, getByPlaceholderText } = render(
            <RegisterScreen />
        );

        fireEvent.changeText(getByLabelText('Nom'), 'Michael');
        fireEvent.changeText(getByLabelText('Adresse email'), 'michael@myers.com');
        fireEvent.changeText(getByLabelText('Mot de passe'), 'Password1234');
        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Étape 2 : Famille')).toBeTruthy();
        });

        fireEvent.press(getByText('Créer une nouvelle famille'));
        const familyNameInput = getByPlaceholderText('Nom de la famille');
        fireEvent.changeText(familyNameInput, 'Ma Famille');
        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Créer')).toBeTruthy();
        });

        fireEvent.press(getByText('Créer'));

        await waitFor(() => expect(mockRegister).not.toHaveBeenCalled());
        await waitFor(() => expect(getByText('Email invalide')).toBeTruthy());
    });

    it('redirects after successful registration', async () => {
        mockRegister.mockResolvedValueOnce({});
        const { getByText, getByLabelText, getByPlaceholderText } = render(
            <RegisterScreen />
        );

        fireEvent.changeText(getByLabelText('Nom'), 'Michael');
        fireEvent.changeText(getByLabelText('Adresse email'), 'michael@myers.com');
        fireEvent.changeText(getByLabelText('Mot de passe'), 'Password1234');
        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Étape 2 : Famille')).toBeTruthy();
        });

        fireEvent.press(getByText('Créer une nouvelle famille'));
        const familyNameInput = getByPlaceholderText('Nom de la famille');
        fireEvent.changeText(familyNameInput, 'Ma Famille');
        fireEvent.press(getByText('Suivant'));

        await waitFor(() => {
            expect(getByText('Créer')).toBeTruthy();
        });

        fireEvent.press(getByText('Créer'));

        await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/'));
    });
});
