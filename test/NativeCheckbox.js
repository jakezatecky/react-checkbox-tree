import React from 'react';
import { mount } from 'enzyme';
import { assert } from 'chai';

import NativeCheckbox from '../src/js/NativeCheckbox';

describe('<NativeCheckbox />', () => {
    describe('indeterminate', () => {
        it('should set the JavaScript property to true when true', () => {
            const wrapper = mount(
                <NativeCheckbox indeterminate />,
            );

            assert.isTrue(wrapper.find('input').getDOMNode().indeterminate);
        });

        it('should set the JavaScript property to false when not true', () => {
            const wrapper = mount(
                <NativeCheckbox />,
            );

            assert.isFalse(wrapper.find('input').getDOMNode().indeterminate);
        });
    });
});
