import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AvatarCustomizer } from '@/components/AvatarCustomizer';
import { faceColorChoices } from '@/constants/Avatar';

describe('AvatarCustomizer', () => {
    it('renders the avatar component correctly', () => {
        const { getByLabelText } = render(
            <AvatarCustomizer onAvatarChange={jest.fn()} />
        );

        expect(getByLabelText('Changer la couleur de peau')).toBeTruthy();
        expect(getByLabelText('Changer la forme des oreilles')).toBeTruthy();
        expect(getByLabelText('Changer le style de sourcils')).toBeTruthy();
        expect(getByLabelText('Changer la forme des yeux')).toBeTruthy();
        expect(getByLabelText('Ajouter des lunettes')).toBeTruthy();
        expect(getByLabelText('Changer la forme de la bouche')).toBeTruthy();
        expect(getByLabelText('Changer la forme du nez')).toBeTruthy();
        expect(getByLabelText('Changer le style de coiffure')).toBeTruthy();
        expect(getByLabelText('Changer la couleur de cheveux')).toBeTruthy();
        expect(getByLabelText('Changer le style de tee shirt')).toBeTruthy();
        expect(getByLabelText('Changer la couleur de tee shirt')).toBeTruthy();
        expect(getByLabelText('Changer le style de chapeau')).toBeTruthy();
        expect(getByLabelText('Changer la couleur de chapeau')).toBeTruthy();
        expect(getByLabelText('Changer la couleur de fond')).toBeTruthy();
    });

    it('cycles avatar attributes when buttons are pressed', () => {
        const onAvatarChangeMock = jest.fn();
        const { getByLabelText } = render(
            <AvatarCustomizer onAvatarChange={onAvatarChangeMock} />
        );

        const faceColorButton = getByLabelText('Changer la couleur de peau');
        fireEvent.press(faceColorButton);

        expect(onAvatarChangeMock).toHaveBeenCalled();
        expect(onAvatarChangeMock).toHaveBeenCalledWith(expect.objectContaining({
            faceColor: faceColorChoices[1],
        }));
    });
});
