import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';

import Button from '../src/js/Button';

describe('<Button />', () => {
    describe('title', () => {
        it('should copy `title` to `aria-label`', () => {
            const wrapper = shallow((
                <Button title="Collapse">
                    Collapse
                </Button>
            ));

            assert.equal('Collapse', wrapper.find('button').prop('aria-label'));
        });

        it('should set `type` to `button`', () => {
            const wrapper = shallow((
                <Button>
                    Basic Button
                </Button>
            ));

            assert.equal('button', wrapper.find('button').prop('type'));
        });

        it('should pass extra properties to the base button', () => {
            const wrapper = shallow((
                <Button className="btn">
                    Basic Button
                </Button>
            ));

            assert.equal('btn', wrapper.find('button').prop('className'));
        });
    });
});
