import { assert } from 'chai';

import { expandNodesToLevel } from '../src';

const nestedTree = [{
    value: '0',
    label: 'Node 0',
    children: [{
        value: '0-0',
        label: 'Node 0-0',
    }, {
        value: '0-1',
        label: 'Node 0-1',
        children: [{
            value: '0-1-0',
            label: 'Node 0-1-0',
            children: [{
                value: '0-1-0-0',
                label: 'Node 0-1-0-0',
            }],
        }, {
            value: '0-1-1',
            label: 'Node 0-1-1',
            children: [{
                value: '0-1-1-0',
                label: 'Node 0-1-1-0',
            }],
        }],
    }, {
        value: '0-2',
        label: 'Node 0-2',
    }],
}, {
    value: '1',
    label: 'Node 1',
}];

describe('utils', () => {
    describe('expandNodesToLevel', () => {
        it('should recursively traverse a tree of nodes and return the key values of parents from the level specified', () => {
            const expected = ['0', '0-1'];

            assert.deepEqual(expected, expandNodesToLevel(nestedTree, 1));
        });
    });
});
