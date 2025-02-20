import { StyleSheet, View } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { TextInput } from '@/components/ui/TextInput';
import { ThemedText } from '@/components/ThemedText';

type RegisterStepOneProps = {
    nextStep: () => void;
};

export function RegisterStepOne({ nextStep }: RegisterStepOneProps) {
    const { control, trigger } = useFormContext();

    const handleNextStep = async () => {
        const validationResult = await trigger();
        if (validationResult) {
            nextStep();
        }
    };

    return (
        <View style={styles.container}>
            <ThemedText type="subtitle" style={styles.title}>
                Étape 1 : Informations
            </ThemedText>

            <TextInput
                name="name"
                control={control}
                placeholder="Nom"
                accessibilityLabel="Nom"
                rules={{
                    required: 'Le nom est obligatoire',
                    maxLength: { value: 150, message: 'Le nom ne doit pas dépasser 150 caractères' },
                }}
            />

            <TextInput
                name="email"
                control={control}
                placeholder="Adresse email"
                accessibilityLabel="Adresse email"
                rules={{
                    required: "L'email est obligatoire.",
                    pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Cet email n'est pas un email valide" },
                    maxLength: { value: 180, message: "L'adresse email ne doit pas dépasser 180 caractères" },
                }}
                keyboardType="email-address"
            />

            <PasswordInput
                name="password"
                control={control}
                placeholder="Mot de passe"
                accessibilityLabel="Mot de passe"
                rules={{
                    required: 'Le mot de passe est obligatoire.',
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,}$/,
                        message:
                            "Le mot de passe doit être composé d'au minimum 8 caractères, et comporter au moins 1 lettre majuscule, 1 lettre minuscule et 1 chiffre.",
                    },
                }}
                autocomplete="password-new"
            />

            <View style={styles.buttonsContainer}>
                <Button text="Suivant" accessibilityLabel="Page suivante" onButtonPress={handleNextStep} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '25%',
    },
    title: {
        marginBottom: 20,
    },
    buttonsContainer: {
        alignItems: 'flex-end',
    },
});
