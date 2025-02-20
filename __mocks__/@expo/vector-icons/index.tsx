import React from 'react';
import { Text } from 'react-native';

export const Ionicons = ({ name, accessibilityLabel }) => {
    return <Text accessibilityLabel={accessibilityLabel}>{name}</Text>
};

export const FontAwesome = ({ name }) => <Text>{name}</Text>;
