import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
    it('renders the button correctly', () => {
        const { getByText, getByLabelText } = render(
            <Button text='Click me' accessibilityLabel='And see the magic!' onButtonPress={jest.fn()} />
        );

        expect(getByText('Click me')).toBeTruthy();
        expect(getByLabelText('And see the magic!')).toBeTruthy();
        const button = getByLabelText('And see the magic!');
        expect(button).toHaveProp('accessibilityRole', 'button');
    });

    it('calls onButtonPress when button is pressed', () => {
        const mockOnPress = jest.fn();

        const { getByLabelText } = render(
            <Button text='Click me' accessibilityLabel='And see the magic!' onButtonPress={mockOnPress} />
        );

        fireEvent.press(getByLabelText('And see the magic!'));
        expect(mockOnPress).toHaveBeenCalled();
    });

    it('applies normal size styles by default', () => {
        const { getByTestId } = render(
            <Button text='Click me' accessibilityLabel='And see the magic!' onButtonPress={jest.fn()} />
        );

        const button = getByTestId('button-inner-container');
        expect(button).toHaveStyle({
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
        });
    });

    it('applies small size styles when size="small"', () => {
        const { getByTestId } = render(
            <Button text='Click me' accessibilityLabel='And see the magic!' onButtonPress={jest.fn()} size='small' />
        );

        const button = getByTestId('button-inner-container');
        expect(button).toHaveStyle({
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 8,
        });
    });

    it('matches the snapshot', () => {
        const tree = render(
            <Button text='Click me' accessibilityLabel='And see the magic!' onButtonPress={jest.fn()} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
