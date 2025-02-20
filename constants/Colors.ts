/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
    light: {
        text: '#11181C',
        background: '#fffaf0',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        button: {
            background: '#151718',
            text: '#f0e3c9',
        },
        input: {
            borderColor: '#151718',
            color: '#151718',
        },
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
        button: {
            background: '#f0e3c9',
            text: '#151718',
        },
        input: {
            borderColor: '#f0e3c9',
            color: '#f0e3c9',
        },
    },
};
