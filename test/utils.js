import { assert } from 'chai';

import { checkAllNodes, expandNodesToLevel } from '#src/index.js';

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

    describe('checkAllNodes', () => {
        it('should return every leaf value by default', () => {
            const expected = ['0-0', '0-1-0-0', '0-1-1-0', '0-2', '1'];

            assert.deepEqual(expected, checkAllNodes(nestedTree));
        });

        it('should also return parent values when `checkModel` is `all`', () => {
            const expected = ['0', '0-0', '0-1', '0-1-0', '0-1-0-0', '0-1-1', '0-1-1-0', '0-2', '1'];

            assert.deepEqual(expected, checkAllNodes(nestedTree, { checkModel: 'all' }));
        });

        it('should return every node value when `noCascade` is set', () => {
            const expected = ['0', '0-0', '0-1', '0-1-0', '0-1-0-0', '0-1-1', '0-1-1-0', '0-2', '1'];

            assert.deepEqual(expected, checkAllNodes(nestedTree, { noCascade: true }));
        });

        it('should include empty parents, which track their own state', () => {
            const nodes = [
                { value: 'empty', label: 'Empty', children: [] },
                { value: 'leaf', label: 'Leaf' },
            ];

            assert.deepEqual(['empty', 'leaf'], checkAllNodes(nodes));
        });

        it('should exclude disabled leaves and leave their parents unchecked under `all`', () => {
            const nodes = [{
                value: 'parent',
                label: 'Parent',
                children: [
                    { value: 'enabled', label: 'Enabled' },
                    { value: 'disabled', label: 'Disabled', disabled: true },
                ],
            }];

            assert.deepEqual(['enabled'], checkAllNodes(nodes));
            assert.deepEqual(['enabled'], checkAllNodes(nodes, { checkModel: 'all' }));
        });

        it('should cascade a disabled parent to its descendants', () => {
            const nodes = [{
                value: 'root',
                label: 'Root',
                children: [{
                    value: 'disabled-parent',
                    label: 'Disabled Parent',
                    disabled: true,
                    children: [
                        { value: 'child', label: 'Child' },
                        { value: 'empty', label: 'Empty', children: [] },
                    ],
                }, {
                    value: 'sibling',
                    label: 'Sibling',
                }],
            }];

            assert.deepEqual(['sibling'], checkAllNodes(nodes));
            assert.deepEqual(['sibling'], checkAllNodes(nodes, { checkModel: 'all' }));
        });

        it('should not cascade a disabled parent when `noCascade` is set', () => {
            const nodes = [{
                value: 'disabled-parent',
                label: 'Disabled Parent',
                disabled: true,
                children: [{ value: 'child', label: 'Child' }],
            }];

            assert.deepEqual(['child'], checkAllNodes(nodes, { noCascade: true }));
        });
    });
});
