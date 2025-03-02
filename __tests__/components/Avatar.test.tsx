import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Avatar } from '@/components/Avatar';

describe('Avatar', () => {
    it('renders blank space', () => {
        const { getByTestId } = render(
            <Avatar type="blank-space" />
        );

        expect(getByTestId('blank-space')).toBeTruthy();
    });

    it('renders create button and handles onPress', () => {
        const onPressMock = jest.fn();
        const { getByLabelText } = render(
            <Avatar type="create" onPressCreate={onPressMock} onPressCreateLabel="Create Avatar" />
        );

        const button = getByLabelText('Create Avatar');
        fireEvent.press(button);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('renders an avatar with valid config', () => {
        const familyMember = { name: 'Tommy Doyle', avatar: JSON.stringify({ sex: 'man', hairColor: '#000000' }) };
        const { getByText } = render(
            <Avatar type="avatar" familyMember={familyMember} />
        );

        expect(getByText('Tommy Doyle')).toBeTruthy();
    });

    it('renders default avatar if config is invalid', () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const familyMember = { name: 'Samuel Loomis', avatar: 'invalid-json' };
        const { getByText } = render(
            <Avatar type="avatar" familyMember={familyMember} />
        );

        expect(getByText('Samuel Loomis')).toBeTruthy();
        expect(consoleErrorMock).toHaveBeenCalledWith(
            'Invalid avatar config:',
            expect.any(SyntaxError)
        );
        consoleErrorMock.mockRestore();
    });
});
