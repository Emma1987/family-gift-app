import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ReactNiceAvatar, { AvatarFullConfig } from '@zamplyy/react-native-nice-avatar';

import { Button } from '@/components/ui/Button';
import { ThemedText } from './ThemedText';
import {
    genderChoices,
    earSizeChoices,
    hairStyleChoices,
    eyeBrowStyleChoices,
    eyeStyleChoices,
    glassesStyleChoices,
    hatStyleChoices,
    mouthStyleChoices,
    noseStyleChoices,
    shirtStyleChoices,
    faceColorChoices,
    hairColorChoices,
    shirtColorChoices,
    hatColorChoices,
    bgColorChoices,
} from '@/constants/Avatar';

type AvatarCustomizerProps = {
    onAvatarChange: (config: any) => void;
};

export function AvatarCustomizer({ onAvatarChange }: AvatarCustomizerProps) {
    const [avatarConfig, setAvatarConfig] = useState<AvatarFullConfig>({
        sex: genderChoices[0],
        earSize: earSizeChoices[0],
        hairStyle: hairStyleChoices[0],
        eyeBrowStyle: eyeBrowStyleChoices[0],
        eyeStyle: eyeStyleChoices[0],
        glassesStyle: glassesStyleChoices[0],
        hatStyle: hatStyleChoices[0],
        mouthStyle: mouthStyleChoices[0],
        noseStyle: noseStyleChoices[0],
        shirtStyle: shirtStyleChoices[0],
        faceColor: faceColorChoices[0],
        hairColor: hairColorChoices[0],
        shirtColor: shirtColorChoices[0],
        hatColor: hatColorChoices[0],
        bgColor: bgColorChoices[0],
    });

    const cycleAvatarConfigKey = <T extends keyof AvatarFullConfig>(key: T, choices: AvatarFullConfig[T][]) => {
        setAvatarConfig((prevConfig) => {
            const currentIndex = choices.indexOf(prevConfig[key]);
            const nextIndex = (currentIndex + 1) % choices.length;

            return { ...prevConfig, [key]: choices[nextIndex] };
        });
    };

    useEffect(() => {
        onAvatarChange(avatarConfig);
    }, [avatarConfig]);

    return (
        <View>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <ReactNiceAvatar size={150} {...avatarConfig} />
            </View>

            {/* Face options */}
            <View style={styles.optionsContainer}>
                <ThemedText style={styles.optionsTitle}>Visage</ThemedText>
                <View style={styles.buttonsContainer}>
                    <Button
                        text={'💁🏼‍♀️'}
                        accessibilityLabel={'Changer la couleur de peau'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('faceColor', faceColorChoices)}
                    />
                    <Button
                        text={'👂🏽'}
                        accessibilityLabel={'Changer la forme des oreilles'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('earSize', earSizeChoices)}
                    />
                    <Button
                        text={'🧔🏽‍♀️'}
                        accessibilityLabel={'Changer le style de sourcils'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('eyeBrowStyle', eyeBrowStyleChoices)}
                    />
                    <Button
                        text={'👁️'}
                        accessibilityLabel={'Changer la forme des yeux'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('eyeStyle', eyeStyleChoices)}
                    />
                    <Button
                        text={'👓'}
                        accessibilityLabel={'Ajouter des lunettes'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('glassesStyle', glassesStyleChoices)}
                    />
                    <Button
                        text={'👄'}
                        accessibilityLabel={'Changer la forme de la bouche'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('mouthStyle', mouthStyleChoices)}
                    />
                    <Button
                        text={'👃🏽'}
                        accessibilityLabel={'Changer la forme du nez'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('noseStyle', noseStyleChoices)}
                    />
                </View>
            </View>

            {/* Hair options */}
            <View style={styles.optionsContainer}>
                <ThemedText style={styles.optionsTitle}>Cheveux</ThemedText>
                <View style={styles.buttonsContainer}>
                    <Button
                        text={'💇🏽‍♀️'}
                        accessibilityLabel={'Changer le style de coiffure'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('hairStyle', hairStyleChoices)}
                    />
                    <Button
                        text={'👩🏼‍🦰'}
                        accessibilityLabel={'Changer la couleur de cheveux'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('hairColor', hairColorChoices)}
                    />
                </View>
            </View>

            {/* Tee-shirt options */}
            <View style={styles.optionsContainer}>
                <ThemedText style={styles.optionsTitle}>Tee shirt</ThemedText>
                <View style={styles.buttonsContainer}>
                    <Button
                        text={'👕'}
                        accessibilityLabel={'Changer le style de tee shirt'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('shirtStyle', shirtStyleChoices)}
                    />
                    <Button
                        text={'🔵'}
                        accessibilityLabel={'Changer la couleur de tee shirt'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('shirtColor', shirtColorChoices)}
                    />
                </View>
            </View>

            {/* Hat options */}
            <View style={styles.optionsContainer}>
                <ThemedText style={styles.optionsTitle}>Chapeau</ThemedText>
                <View style={styles.buttonsContainer}>
                    <Button
                        text={'🎩'}
                        accessibilityLabel={'Changer le style de chapeau'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('hatStyle', hatStyleChoices)}
                    />
                    <Button
                        text={'🔴'}
                        accessibilityLabel={'Changer la couleur de chapeau'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('hatColor', hatColorChoices)}
                    />
                </View>
            </View>

            {/* Background options */}
            <View style={styles.optionsContainer}>
                <ThemedText style={styles.optionsTitle}>Fond</ThemedText>
                <View style={styles.buttonsContainer}>
                    <Button
                        text={'🟠'}
                        accessibilityLabel={'Changer la couleur de fond'}
                        size="small"
                        onButtonPress={() => cycleAvatarConfigKey('bgColor', bgColorChoices)}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
    },
    optionsTitle: {
        width: '30%',
    },
    buttonsContainer: {
        width: '70%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        marginBottom: 5,
        alignItems: 'center',
    },
});
