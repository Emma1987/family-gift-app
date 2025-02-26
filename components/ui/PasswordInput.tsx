import { useState } from 'react';
import { StyleSheet, TextInput as RNTextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useFormContext, RegisterOptions } from 'react-hook-form';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

type PasswordInputProps = {
    name: string;
    control: any;
    placeholder: string;
    accessibilityLabel: string;
    rules?: RegisterOptions;
    autocomplete?: 'password' | 'password-new';
};

export function PasswordInput({
    name,
    control,
    placeholder,
    accessibilityLabel,
    rules = {},
    autocomplete = 'password',
}: PasswordInputProps) {
    const inputBorderColor = useThemeColor({}, 'inputBorderColor');
    const inputColor = useThemeColor({}, 'inputColor');
    const { trigger } = useFormContext();

    const [isValueDisplayed, setIsValueDisplayed] = useState<boolean>(false);

    return (
        <View>
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                        <View
                            style={[
                                styles.inputContainer,
                                { borderColor: inputBorderColor },
                                error && styles.inputError,
                            ]}
                        >
                            <RNTextInput
                                style={[styles.input, { color: inputColor }]}
                                onChangeText={onChange}
                                onBlur={() => {
                                    onBlur();
                                    trigger(name);
                                }}
                                value={value}
                                placeholder={placeholder}
                                accessibilityLabel={accessibilityLabel}
                                autoCorrect={false}
                                secureTextEntry={!isValueDisplayed}
                                autoCapitalize="none"
                                autoComplete={autocomplete}
                            />
                            <TouchableOpacity style={styles.icon} onPress={() => setIsValueDisplayed((prev) => !prev)}>
                                <Ionicons
                                    name={isValueDisplayed ? 'eye-outline' : 'eye-off-outline'}
                                    size={25}
                                    color={inputColor}
                                    accessibilityLabel="Changer la visibilité du mot de passe"
                                    accessibilityRole="button"
                                    importantForAccessibility="no-hide-descendants"
                                />
                            </TouchableOpacity>
                        </View>
                        {error?.message && <ThemedText style={styles.errorText}>{error.message}</ThemedText>}
                    </>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 45,
        fontWeight: '500',
    },
    icon: {
        padding: 10,
    },
    inputError: {
        borderBottomColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -20,
    },
});
