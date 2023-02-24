import React from 'react';
import { assert } from 'chai';
import { render, screen } from '@testing-library/react';

import NativeCheckbox from '../src/js/components/NativeCheckbox';

describe('<NativeCheckbox />', () => {
    describe('indeterminate', () => {
        it('should set the JavaScript property to true when true', () => {
            render(<NativeCheckbox indeterminate />);

            assert.isTrue(screen.getByRole('checkbox').indeterminate);
        });

        it('should set the JavaScript property to false when not true', () => {
            render(<NativeCheckbox />);

            assert.isFalse(screen.getByRole('checkbox').indeterminate);
        });
    });
});
