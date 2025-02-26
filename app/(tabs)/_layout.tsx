import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/navigation/TabBarBackground';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [loading, isAuthenticated]);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="gift/index"
                options={{
                    title: 'Cadeaux',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'gift' : 'gift-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
