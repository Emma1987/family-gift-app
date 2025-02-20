import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

type ButtonProps = {
    text: string;
    accessibilityLabel: string;
    size?: 'small' | 'normal';
    onButtonPress: () => void;
};

export function Button({ text, accessibilityLabel, size = 'normal', onButtonPress }: ButtonProps) {
    const buttonThemeStyle = useThemeColor({}, 'button');

    const buttonStyle = [
        styles.button,
        size === 'normal' ? styles.normalButton : styles.smallButton,
        { backgroundColor: buttonThemeStyle.background },
    ];

    return (
        <TouchableOpacity onPress={onButtonPress} accessibilityLabel={accessibilityLabel} accessibilityRole="button">
            <ThemedView style={buttonStyle} testID="button-inner-container">
                <ThemedText style={[styles.text, { color: buttonThemeStyle.text }]}>{text}</ThemedText>
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
    },
    normalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    smallButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
