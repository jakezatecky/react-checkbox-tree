import React from 'react';
import { assert } from 'chai';
import { render, screen } from '@testing-library/react';

import Button from '../src/js/components/Button';

describe('<Button />', () => {
    describe('title', () => {
        it('should copy `title` to `aria-label`', () => {
            render((
                <Button title="Collapse">
                    Collapse
                </Button>
            ));

            const button = screen.getByText('Collapse');
            assert.equal(button.getAttribute('aria-label'), 'Collapse');
        });

        it('should set `type` to `button`', () => {
            render((
                <Button>
                    Basic Button
                </Button>
            ));

            const button = screen.getByText('Basic Button');
            assert.equal(button.type, 'button');
        });

        it('should pass extra properties to the base button', () => {
            render((
                <Button className="btn">
                    Basic Button
                </Button>
            ));

            const button = screen.getByText('Basic Button');
            assert.equal(button.className, 'btn');
        });
    });
});
