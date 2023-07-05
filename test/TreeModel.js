import { assert } from 'chai';

import TreeModel from '../src/js/models/TreeModel';

const nestedTree = [
    {
        value: '0',
        label: 'Node 0',
        children: [
            {
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
                        checked: true,
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
            },
        ],
    }, {
        value: '1',
        label: 'Node 1',
    },
];

const defaultOptions = {
    checkModel: 'leaf',
    disabled: false,
    noCascadeChecks: false,
    noCascadeDisabled: false,
    optimisticToggle: true,
    setTreeModel: () => {},
};

describe('TreeModel', () => {
    describe('clone()', () => {
        it('should return a new cloned TreeModel', () => {
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const cloneTreeModel = treeModel.clone();

            assert.notEqual(treeModel, cloneTreeModel);
            assert.deepEqual(treeModel, cloneTreeModel);
        });
    });

    describe('expandAllNodes(expandValue = true)', () => {
        it('should expand all nodes of the tree and return the new updated TreeModel', () => {
            const expected = ['0', '0-1-0', '0-1-1', '0-1'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.expandAllNodes();
            const actual = newTreeModel.getExpanded();

            assert.deepEqual(expected, actual);
        });

        it('should collapse all nodes of the tree if passed false and return the new updated TreeModel', () => {
            const expected = [];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const expandedTreeModel = treeModel.expandAllNodes();
            const collapsedTreeModel = expandedTreeModel.expandAllNodes(false);
            const actual = collapsedTreeModel.getExpanded();

            assert.deepEqual(expected, actual);
        });
    });

    describe('expandNodesToLevel(targetLevel)', () => {
        it('should expand the nodes of the tree down to a given level and return the new updated TreeModel', () => {
            const expected = ['0', '0-1'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.expandNodesToLevel(1);
            const actual = newTreeModel.getExpanded();

            assert.deepEqual(expected, actual);
        });
    });

    describe('filter(testFunc)', () => {
        it('should return a filtered TreeModel', () => {
            const expected = {
                rootKeys: ['0'],
                unfilteredRootKeys: ['0', '1'],
                options: defaultOptions,
                nodes: {
                    0: {
                        value: '0',
                        label: 'Node 0',
                        childKeys: ['0-0', '0-1', '0-2'],
                        expanded: false,
                        checkState: 2,
                        parentKey: '',
                        isChild: false,
                        isParent: true,
                        isLeaf: false,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: false,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 0,
                        treeDepth: 0,
                    },
                    1: {
                        value: '1',
                        label: 'Node 1',
                        childKeys: null,
                        expanded: false,
                        checkState: 0,
                        parentKey: '',
                        isChild: false,
                        isParent: false,
                        isLeaf: true,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: true,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 1,
                        treeDepth: 0,
                    },
                    '0-0': {
                        value: '0-0',
                        label: 'Node 0-0',
                        childKeys: null,
                        expanded: false,
                        checkState: 0,
                        parentKey: '0',
                        isChild: true,
                        isParent: false,
                        isLeaf: true,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: true,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 0,
                        treeDepth: 1,
                    },
                    '0-1-0-0': {
                        value: '0-1-0-0',
                        label: 'Node 0-1-0-0',
                        childKeys: null,
                        expanded: false,
                        checkState: 1,
                        parentKey: '0-1-0',
                        isChild: true,
                        isParent: false,
                        isLeaf: true,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: true,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 0,
                        treeDepth: 3,
                    },
                    '0-1-0': {
                        value: '0-1-0',
                        label: 'Node 0-1-0',
                        childKeys: ['0-1-0-0'],
                        expanded: false,
                        checkState: 1,
                        parentKey: '0-1',
                        isChild: true,
                        isParent: true,
                        isLeaf: false,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: false,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 0,
                        treeDepth: 2,
                    },
                    '0-1-1-0': {
                        value: '0-1-1-0',
                        label: 'Node 0-1-1-0',
                        childKeys: null,
                        expanded: false,
                        checkState: 0,
                        parentKey: '0-1-1',
                        isChild: true,
                        isParent: false,
                        isLeaf: true,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: true,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 0,
                        treeDepth: 3,
                    },
                    '0-1-1': {
                        value: '0-1-1',
                        label: 'Node 0-1-1',
                        childKeys: ['0-1-1-0'],
                        expanded: false,
                        checkState: 0,
                        parentKey: '0-1',
                        isChild: true,
                        isParent: true,
                        isLeaf: false,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: true,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 1,
                        treeDepth: 2,
                    },
                    '0-1': {
                        value: '0-1',
                        label: 'Node 0-1',
                        childKeys: ['0-1-0', '0-1-1'],
                        expanded: false,
                        checkState: 2,
                        parentKey: '0',
                        isChild: true,
                        isParent: true,
                        isLeaf: false,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: false,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 1,
                        treeDepth: 1,
                    },
                    '0-2': {
                        value: '0-2',
                        label: 'Node 0-2',
                        childKeys: null,
                        expanded: false,
                        checkState: 0,
                        parentKey: '0',
                        isChild: true,
                        isParent: false,
                        isLeaf: true,
                        isRadioGroup: false,
                        isRadioNode: false,
                        isHiddenByFilter: true,
                        disabled: false,
                        icon: null,
                        showCheckbox: true,
                        index: 2,
                        treeDepth: 1,
                    },
                },
            };
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const testFn = (node) => (node.label === 'Node 0-1-0');
            const filteredTreeModel = treeModel.filter(testFn);

            assert.deepEqual(expected, filteredTreeModel);
        });
    });

    describe('getChecked()', () => {
        it('should return the checked array', () => {
            const expected = ['0-1-0-0'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const actual = treeModel.getChecked();

            assert.deepEqual(expected, actual);
        });

        it("should return the array of checked leaf nodes if treeModel.options.checkModel === 'leaf'", () => {
            const expected = ['0-1-0-0'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.updateOptions({ checkModel: 'leaf' });
            const actual = newTreeModel.getChecked();

            assert.deepEqual(expected, actual);
        });

        it("should return the array of checked parent nodes if treeModel.options.checkModel === 'parent'", () => {
            const expected = ['0', '0-1', '0-1-0'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.updateOptions({ checkModel: 'parent' });
            const actual = newTreeModel.getChecked();

            assert.deepEqual(expected, actual);
        });

        it("should return the array of all checked nodes if treeModel.options.checkModel === 'all'", () => {
            const expected = ['0', '0-1', '0-1-0', '0-1-0-0'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.updateOptions({ checkModel: 'all' });
            const actual = newTreeModel.getChecked();

            assert.deepEqual(expected, actual);
        });
    });

    describe('getDisabled()', () => {
        it('should return the array of disabled nodes', () => {
            const expected = ['0-1-0', '0-1-1', '0-1'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.toggleDisabled('0-1');
            const actual = newTreeModel.getDisabled();

            assert.deepEqual(expected, actual);
        });
    });

    describe('getExpanded()', () => {
        it('should return the array of expanded nodes', () => {
            const expected = ['0', '0-1-0', '0-1-1', '0-1'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.expandAllNodes();
            const actual = newTreeModel.getExpanded();

            assert.deepEqual(expected, actual);
        });
    });

    describe('getNode(nodeKey)', () => {
        it('should return the requested node', () => {
            const expected = {
                value: '0',
                label: 'Node 0',
                childKeys: ['0-0', '0-1', '0-2'],
                expanded: false,
                checkState: 2,
                parentKey: '',
                isChild: false,
                isParent: true,
                isLeaf: false,
                isRadioGroup: false,
                isRadioNode: false,
                isHiddenByFilter: false,
                disabled: false,
                icon: null,
                showCheckbox: true,
                index: 0,
                treeDepth: 0,
            };
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const actual = treeModel.getNode('0');

            assert.deepEqual(expected, actual);
        });
    });

    describe('removeFilter()', () => {
        it('should return the unfiltered TreeModel', () => {
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const filteredTreeModel = treeModel.filter((node) => node.value === 'Node 0-1-0');
            const unfilteredTreeModel = filteredTreeModel.removeFilter();

            assert.deepEqual(treeModel, unfilteredTreeModel);
        });
    });

    describe('updateOptions(newOptions)', () => {
        it('should return a new TreeModel with updated options', () => {
            const expected = defaultOptions;
            expected.noCascadeChecks = true;
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.updateOptions({ noCascadeChecks: true });

            assert.deepEqual(expected, newTreeModel.options);
        });
    });

    describe('setNodeProp(nodeKey, propertyName, value)', () => {
        it('should return a new TreeModel with the updated node property', () => {
            const expected = {
                value: '0-1',
                label: 'Node 0-1',
                childKeys: ['0-1-0', '0-1-1'],
                expanded: false,
                checkState: 2,
                parentKey: '0',
                isChild: true,
                isParent: true,
                isLeaf: false,
                isRadioGroup: false,
                isRadioNode: false,
                isHiddenByFilter: false,
                disabled: false,
                icon: null,
                showCheckbox: true,
                index: 1,
                treeDepth: 1,
                newProp: 'newValue',
            };
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.setNodeProp('0-1', 'newProp', 'newValue');
            const updatedNode = newTreeModel.getNode('0-1');

            assert.deepEqual(expected, updatedNode);
        });
    });

    describe('toggleChecked(nodeKey)', () => {
        it('should return a new TreeModel with checked property toggled on node with value === nodeKey', () => {
            const expected = ['0-1-0-0'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.toggleChecked('0-1');
            const actual = newTreeModel.getChecked();

            assert.deepEqual(expected, actual);
        });

        it('should toggle parents of the node if needed', () => {
            const expected = ['0', '0-1-0', '0-1-0-0'];
            const treeModel = new TreeModel(nestedTree, { ...defaultOptions, checkModel: 'all' });
            const newTreeModel = treeModel.toggleChecked('0-1');
            const actual = newTreeModel.getChecked();

            assert.deepEqual(expected, actual);
        });
    });

    describe('toggleDisabled(nodeKey)', () => {
        it('should return a new TreeModel with disabled property toggled on node with value === nodeKey', () => {
            const expected = ['0-1-0', '0-1-1', '0-1'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.toggleDisabled('0-1');
            const actual = newTreeModel.getDisabled();

            assert.deepEqual(expected, actual);
        });

        it('should not disable child nodes if noCascadeDisabled === true', () => {
            const expected = ['0-1'];
            const treeModel = new TreeModel(
                nestedTree,
                { ...defaultOptions, noCascadeDisabled: true },
            );
            const newTreeModel = treeModel.toggleDisabled('0-1');
            const actual = newTreeModel.getDisabled();

            assert.deepEqual(expected, actual);
        });
    });

    describe('toggleExpanded(nodeKey)', () => {
        it('should return a new TreeModel with expanded property toggled on node with value === nodeKey', () => {
            const expected = ['0-1'];
            const treeModel = new TreeModel(nestedTree, defaultOptions);
            const newTreeModel = treeModel.toggleExpanded('0-1');
            const actual = newTreeModel.getExpanded();

            assert.deepEqual(expected, actual);
        });
    });
});
