import { type ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps extends ComponentProps<typeof Ionicons> {
    style?: object;
}

export function TabBarIcon({ style, ...rest }: TabBarIconProps) {
    return <Ionicons size={25} style={[{ marginBottom: -3 }, style]} {...rest} />;
}
