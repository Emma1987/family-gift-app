import ReactNiceAvatar, { genConfig } from '@zamplyy/react-native-nice-avatar';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AvatarComponentProps } from '@/types/appTypes';

export function Avatar({ type, familyMember, onPressCreateLabel = '', onPressCreate }: AvatarComponentProps) {
    const buttonBackgroundColor = useThemeColor({}, 'buttonBackgroundColor');
    const buttonTextColor = useThemeColor({}, 'buttonTextColor');

    if (type === 'blank-space') {
        return <ThemedView style={{ width: 100, height: 100 }} testID="blank-space"></ThemedView>;
    }

    if (type === 'create' && onPressCreate) {
        return (
            <TouchableOpacity onPress={onPressCreate} accessibilityLabel={onPressCreateLabel ?? ''}>
                <ThemedView style={[styles.button, { backgroundColor: buttonBackgroundColor }]}>
                    <Ionicons name="add" size={50} color={buttonTextColor} />
                </ThemedView>
            </TouchableOpacity>
        );
    }

    if (type === 'avatar' && familyMember?.avatar) {
        let config = genConfig();
        try {
            config = JSON.parse(familyMember.avatar);
        } catch (error) {
            console.error('Invalid avatar config:', error);
        }

        return (
            <ThemedView style={styles.avatar}>
                <ReactNiceAvatar size={100} {...config} />
                <ThemedText style={styles.name}>{familyMember.name}</ThemedText>
            </ThemedView>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        alignItems: 'center',
    },
    name: {
        textAlign: 'center',
        flexWrap: 'wrap',
        maxWidth: 100,
    },
});
