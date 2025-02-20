import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import RadioGroup from 'react-native-radio-buttons-group';

import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

enum FamilyChoiceEnum {
    JOIN = 'join-family',
    CREATE = 'create-family',
}

type RegisterStepTwoProps = {
    nextStep: () => void;
    prevStep: () => void;
};

export function RegisterStepTwo({ nextStep, prevStep }: RegisterStepTwoProps) {
    const inputStyle = useThemeColor({}, 'input');
    const { control, setValue, watch, trigger } = useFormContext();

    const selectedChoice = watch('selectedChoice', null);

    const familyChoices = useMemo(
        () => [
            {
                id: FamilyChoiceEnum.JOIN,
                label: 'Rejoindre ma famille grâce au code famille',
                value: FamilyChoiceEnum.JOIN,
                borderColor: inputStyle.borderColor,
                color: inputStyle.color,
                labelStyle: { color: inputStyle.color },
            },
            {
                id: FamilyChoiceEnum.CREATE,
                label: 'Créer une nouvelle famille',
                value: FamilyChoiceEnum.CREATE,
                borderColor: inputStyle.borderColor,
                color: inputStyle.color,
                labelStyle: { color: inputStyle.color },
            },
        ],
        [inputStyle],
    );

    const handleNextStep = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            nextStep();
        }
    };

    return (
        <View style={styles.container}>
            <ThemedText type="subtitle" style={styles.title}>
                Étape 2 : Famille
            </ThemedText>

            <RadioGroup
                radioButtons={familyChoices}
                onPress={(choice) => setValue('selectedChoice', choice)}
                selectedId={selectedChoice}
                containerStyle={styles.radioContainer}
            />

            {selectedChoice === FamilyChoiceEnum.JOIN && (
                <TextInput
                    name="familyCode"
                    control={control}
                    placeholder="Code famille"
                    accessibilityLabel="Code de la famille"
                    rules={{
                        required: 'Le code famille est obligatoire',
                        pattern: {
                            value: /^[A-Z0-9]{6}$/,
                            message: "Ce code famille n'est pas un code famille valide",
                        },
                    }}
                />
            )}

            {selectedChoice === FamilyChoiceEnum.CREATE && (
                <TextInput
                    name="familyName"
                    control={control}
                    placeholder="Nom de la famille"
                    accessibilityLabel="Nom de la famille"
                    rules={{
                        required: 'Un nom pour créer la famille est obligatoire.',
                        maxLength: { value: 150, message: 'Le nom de la famille ne doit pas dépasser 150 caractères' },
                    }}
                />
            )}

            <View style={styles.buttonsContainer}>
                <Button text="Précédent" accessibilityLabel="Page précédente" onButtonPress={prevStep} />
                <Button text="Suivant" accessibilityLabel="Page suivante" onButtonPress={handleNextStep} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
    },
    title: {
        marginBottom: 20,
    },
    radioContainer: {
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
