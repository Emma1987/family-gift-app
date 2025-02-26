import { useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { TextInput } from '@/components/ui/TextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { LoginInput } from '@/types/types';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const methods = useForm<LoginInput>();

    const onSubmit = methods.handleSubmit(async (data: LoginInput) => {
        try {
            await login(data);
            router.replace('/');
        } catch (error: any) {
            handleLoginError(error);
        }
    });

    const handleLoginError = (error: any) => {
        if (error.code === 401) {
            methods.setError('root.general', {
                type: 'manual',
                message: 'Identifiants invalides.',
            });
        } else {
            console.error('Unexpected error:', error);
            methods.setError('root.general', {
                type: 'manual',
                message: 'Une erreur est survenue lors de la connexion, merci de réessayer ultérieurement.',
            });
        }
    };

    const globalError = methods.formState.errors?.root?.general?.message ?? '';

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.safeAreaContent}>
                    <View>
                        <Image
                            source={require('@/assets/images/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                            accessibilityRole="image"
                            accessibilityLabel="Logo application"
                        />
                    </View>

                    {globalError && (
                        <View style={styles.errorMessage}>
                            <ThemedText type="error">{globalError}</ThemedText>
                        </View>
                    )}

                    <View>
                        <FormProvider {...methods}>
                            <TextInput
                                name="username"
                                control={methods.control}
                                placeholder="Adresse email"
                                accessibilityLabel="Adresse email"
                                rules={{
                                    required: "L'email est obligatoire.",
                                    pattern: {
                                        value: /^[^@]+@[^@]+\.[^@]+$/,
                                        message: "Cet email n'est pas un email valide",
                                    },
                                }}
                                keyboardType="email-address"
                            />
                            <PasswordInput
                                name="password"
                                control={methods.control}
                                placeholder="Mot de passe"
                                accessibilityLabel="Mot de passe"
                                rules={{
                                    required: 'Le mot de passe est obligatoire.',
                                }}
                            />
                            <Button
                                style={styles.loginButton}
                                text={'Connexion'}
                                accessibilityLabel="Connexion"
                                onButtonPress={onSubmit}
                            />
                        </FormProvider>

                        <ThemedText type="link" style={styles.forgotPassword}>
                            Mot de passe oublié
                        </ThemedText>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => router.push('/register')}
                            accessibilityLabel="Aller à la page d'inscription"
                            accessibilityHint="Accéder à la page d'inscription"
                        >
                            <ThemedText style={styles.register}>Pas encore de compte?</ThemedText>
                            <ThemedText type="link" style={styles.register}>
                                Enregistrez-vous
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
    },
    safeArea: {
        flex: 1,
    },
    safeAreaContent: {
        flex: 1,
        justifyContent: 'space-around',
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
    forgotPassword: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 10,
        marginHorizontal: 'auto',
    },
    register: {
        fontSize: 14,
        lineHeight: 20,
        marginHorizontal: 'auto',
    },
    errorMessage: {
        alignItems: 'center',
    },
    loginButton: {
        marginTop: 10,
    },
});
