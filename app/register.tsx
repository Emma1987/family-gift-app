import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { RegisterStepOne } from '@/components/RegisterStepOne';
import { RegisterStepTwo } from '@/components/RegisterStepTwo';
import { RegisterStepThree } from '@/components/RegisterStepThree';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { register as registerService } from '@/graphql/graphqlService';
import { getRegisterInput } from '@/helpers/regiserHelper';
import { RegisterFormData, FamilyChoiceEnum, ValidationViolation } from '@/types/appTypes';

export default function RegisterScreen() {
    const router = useRouter();
    const { setIsAuthenticatedContext } = useAuth();
    const [step, setStep] = useState<number>(1);

    const methods = useForm<RegisterFormData>();

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const { mutateAsync: register } = useMutation({
        mutationFn: registerService,
        onSuccess: () => {
            setIsAuthenticatedContext(true);
            router.replace('/');
        },
    });

    const onSubmit = methods.handleSubmit(async (data: RegisterFormData) => {
        methods.clearErrors();
        const registerInput = getRegisterInput(data);

        try {
            await register(registerInput);
        } catch (error: any) {
            if (error.violations) {
                error.violations.forEach((violation: ValidationViolation) => {
                    const shouldSkip =
                        (data.selectedChoice !== FamilyChoiceEnum.CREATE && violation.field === 'familyName') ||
                        (data.selectedChoice === FamilyChoiceEnum.CREATE && violation.field === 'familyCode');

                    if (shouldSkip) {
                        return;
                    }

                    methods.setError(violation.field as keyof RegisterFormData, {
                        type: 'manual',
                        message: violation.messages.join(', '),
                    });
                });

                await new Promise((resolve) => setTimeout(resolve, 0));

                const errors = methods.formState.errors;
                if (errors.name || errors.email || errors.password) {
                    setStep(1);
                } else if (errors.familyCode || errors.familyName) {
                    setStep(2);
                }
            } else {
                console.error('Unexpected error:', error);
                methods.setError('root.general', {
                    type: 'manual',
                    message: "Une erreur est survenue lors de l'enregistrement, merci de réessayer ultérieurement.",
                });
            }
        }
    });

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                    keyboardVerticalOffset={20}
                >
                    <ScrollView contentContainerStyle={styles.scrollview}>
                        <View>
                            <Image
                                source={require('@/assets/images/icon.png')}
                                style={styles.logo}
                                resizeMode="contain"
                                accessibilityRole="image"
                                accessibilityLabel="Logo application"
                            />
                        </View>

                        {methods.formState.errors?.root?.general?.message && (
                            <View style={styles.errorMessage}>
                                <ThemedText type="error">{methods.formState.errors.root.general.message}</ThemedText>
                            </View>
                        )}

                        <FormProvider {...methods}>
                            {step === 1 && <RegisterStepOne nextStep={nextStep} />}

                            {step === 2 && <RegisterStepTwo nextStep={nextStep} prevStep={prevStep} />}

                            {step === 3 && <RegisterStepThree handleSubmit={onSubmit} prevStep={prevStep} />}
                        </FormProvider>

                        <View>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                accessibilityLabel="Retour à la page de connexion"
                            >
                                <ThemedText type="link" style={styles.login}>
                                    Me connecter
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollview: {
        flexGrow: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 40,
        paddingVertical: 20,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
    login: {
        fontSize: 14,
        lineHeight: 20,
        alignSelf: 'center',
    },
    errorMessage: {
        alignItems: 'center',
    },
});
