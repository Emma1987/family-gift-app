import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/login'; // adjust path as necessary
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

jest.mock('@/context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: jest.fn() }));

describe('LoginScreen', () => {
    const mockLogin = jest.fn();
    const mockRouter = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({ login: mockLogin });
        useRouter.mockReturnValue({ push: mockRouter, replace: mockRouter });
    });

    it('should render the login screen correctly', () => {
        const { getByText, getByPlaceholderText } = render(
            <LoginScreen />
        );

        // Check if important UI elements are present
        expect(getByPlaceholderText('Adresse email')).toBeTruthy();
        expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
        expect(getByText('Connexion')).toBeTruthy();
        expect(getByText('Pas encore de compte?')).toBeTruthy();
        expect(getByText('Enregistrez-vous')).toBeTruthy();
    });

    it('should show error message when form is submitted with empty fields', async () => {
        const { getByText, getByPlaceholderText } = render(
            <LoginScreen />
        );

        fireEvent.changeText(getByPlaceholderText('Adresse email'), '');
        fireEvent.changeText(getByPlaceholderText('Mot de passe'), '');
        fireEvent.press(getByText('Connexion'));

        await waitFor(() => {
            expect(getByText("L'email est obligatoire.")).toBeTruthy();
            expect(getByText('Le mot de passe est obligatoire.')).toBeTruthy();
        });
    });

    it('should handle incorrect login and show error message', async () => {
        mockLogin.mockRejectedValueOnce({ code: 401 });
        const { getByText, getByPlaceholderText } = render(
            <LoginScreen />
        );

        fireEvent.changeText(getByPlaceholderText('Adresse email'), 'michael@myers.com');
        fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password');

        fireEvent.press(getByText('Connexion'));

        await waitFor(() => {
            expect(getByText('Identifiants invalides.')).toBeTruthy();
        });
    });

    it('should navigate to the home page when login is successful', async () => {
        mockLogin.mockResolvedValueOnce({ code: 200 });
        const { getByText, getByPlaceholderText } = render(
            <LoginScreen />
        );

        fireEvent.changeText(getByPlaceholderText('Adresse email'), 'michael@myers.com');
        fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'Password1234');

        fireEvent.press(getByText('Connexion'));

        await waitFor(() => {
            expect(mockRouter).toHaveBeenCalledWith('/');
        });
    });

    it('should navigate to the registration screen when register link is pressed', () => {
        const { getByText } = render(
            <LoginScreen />
        );

        fireEvent.press(getByText('Enregistrez-vous'));

        expect(mockRouter).toHaveBeenCalledWith('/register');
    });

    it('should show unexpected error message if login fails with unknown error', async () => {
        mockLogin.mockRejectedValueOnce({ code: 500 });
        const { getByText, getByPlaceholderText } = render(
            <LoginScreen />
        );

        fireEvent.changeText(getByPlaceholderText('Adresse email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password');

        fireEvent.press(getByText('Connexion'));

        await waitFor(() => {
            expect(getByText('Une erreur est survenue lors de la connexion, merci de réessayer ultérieurement.')).toBeTruthy();
        });
    });
});
