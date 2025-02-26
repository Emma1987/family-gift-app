import { KeyboardTypeOptions, StyleSheet, TextInput as RNTextInput, View } from 'react-native';
import { Controller, useFormContext, RegisterOptions } from 'react-hook-form';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type TextInputProps = {
    name: string;
    control: any;
    placeholder: string;
    accessibilityLabel: string;
    rules?: RegisterOptions;
    keyboardType?: KeyboardTypeOptions;
};

export function TextInput({
    name,
    control,
    placeholder,
    accessibilityLabel,
    rules = {},
    keyboardType = 'default',
}: TextInputProps) {
    const inputBorderColor = useThemeColor({}, 'inputBorderColor');
    const inputColor = useThemeColor({}, 'inputColor');
    const { trigger } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                    <RNTextInput
                        style={[
                            styles.input,
                            { borderColor: inputBorderColor, color: inputColor },
                            error && styles.inputError,
                        ]}
                        onChangeText={onChange}
                        onBlur={() => {
                            onBlur();
                            trigger(name);
                        }}
                        value={value}
                        placeholder={placeholder}
                        accessibilityLabel={accessibilityLabel}
                        keyboardType={keyboardType}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {error?.message && <ThemedText style={styles.errorText}>{error.message}</ThemedText>}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 45,
        borderBottomWidth: 1,
        fontWeight: 500,
        marginBottom: 20,
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
