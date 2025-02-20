import { StyleSheet, View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { AvatarFullConfig } from '@zamplyy/react-native-nice-avatar';

import { Button } from '@/components/ui/Button';
import { AvatarCustomizer } from '@/components/AvatarCustomizer';
import { ThemedText } from '@/components/ThemedText';

type RegisterStepThreeProps = {
    handleSubmit: () => void;
    prevStep: () => void;
};

export function RegisterStepThree({ handleSubmit, prevStep }: RegisterStepThreeProps) {
    const { setValue, watch, trigger } = useFormContext();

    const avatarConfig = watch('avatarConfig', null);

    const handleAvatarChange = (newConfig: AvatarFullConfig) => {
        setValue('avatarConfig', newConfig);
    };

    const handleNextStep = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            handleSubmit();
        }
    };

    return (
        <View style={styles.container}>
            <ThemedText type="subtitle" style={styles.title}>
                Étape 3 : Avatar
            </ThemedText>

            <AvatarCustomizer onAvatarChange={handleAvatarChange} />

            <View style={styles.buttonsContainer}>
                <Button text="Précédent" accessibilityLabel="Page précédente" onButtonPress={prevStep} />
                <Button text="Créer" accessibilityLabel="Créer mon compte" onButtonPress={handleNextStep} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginBottom: 20,
    },
    buttonsContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
