import * as React from 'react';
import { render } from '@testing-library/react-native';

import { ThemedText } from '@/components/ThemedText';

describe('RegisterStepTwo', () => {
    it('matches the snapshot', () => {
        const tree = render(
            <ThemedText>Snapshot test!</ThemedText>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
