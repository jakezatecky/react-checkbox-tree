import React from 'react';
import { assert } from 'chai';
import { render, screen } from '@testing-library/react';
import { configure, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import CheckboxTree from '../src/js/CheckboxTree';
// import CheckboxTreeError from '../src/js/CheckboxTreeError';
import { CheckboxTreeProvider } from '../src/js/CheckboxTreeContext';
import TreeModel from '../src/js/models/TreeModel';
import TreeModelError from '../src/js/models/TreeModelError';

const consoleError = console.error;
/*
const test1 = [
    {
        label: 'Jupiter',
        value: 'jupiter',
        children: [
            { value: 'io', label: 'Io', checked: true },
            { value: 'europa', label: 'Europa' },
        ],
    }, {
        label: 'Saturn',
        value: 'saturn',
        children: [
            { value: ' titan', label: ' Titan', checked: true },
            { value: ' enceladus', label: ' Enceladus', checked: true },
        ],
    }, {
        label: 'Earth',
        value: 'earth',
        children: [
            { value: 'moon', label: 'Moon' },
        ],
    },
];

const test2 = [
    {
        label: 'Earth',
        value: 'earth',
        children: [
            { value: 'moon', label: 'Moon' },
        ],
    },
];
*/
// Increase waitFor timeout to prevent unusual issues when there are many tests
configure({
    asyncUtilTimeout: 10000,
});

describe('<CheckboxTree />', () => {
    describe('component', () => {
        it('should render the react-checkbox-tree container', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree nodes={[]} />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree'));
        });

        it('should rerender using the nodes prop if that prop has changed', () => {
            const { rerender } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                label: 'Jupiter',
                                value: 'jupiter',
                                children: [
                                    { value: 'io', label: 'Io', checked: true },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(screen.queryByLabelText('Jupiter'));

            rerender(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                label: 'Earth',
                                value: 'earth',
                                children: [
                                    { value: 'moon', label: 'Moon' },
                                ],
                            },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNull(screen.queryByLabelText('Jupiter'));
            assert.isNotNull(screen.queryByLabelText('Earth'));
        });
    });

    describe('checkModel', () => {
        describe('all', () => {
            it('should record checked parent and leaf nodes', async () => {
                let actual = null;

                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            checkModel="all"
                            nodes={[
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    children: [
                                        { value: 'io', label: 'Io' },
                                        { value: 'europa', label: 'Europa' },
                                    ],
                                },
                            ]}
                            onCheck={(nodeKey, treeModel) => {
                                actual = treeModel.getChecked();
                            }}
                        />
                    </CheckboxTreeProvider>,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Jupiter'));

                assert.deepEqual(actual, ['jupiter', 'io', 'europa']);
            });

            it('should percolate `checked` to all parents and grandparents if all leaves are checked', async () => {
                let actual = null;

                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            checkModel="all"
                            nodes={[
                                {
                                    value: 'sol',
                                    label: 'Sol System',
                                    expanded: true,
                                    children: [
                                        {
                                            value: 'mercury',
                                            label: 'Mercury',
                                            checked: true,
                                        },
                                        {
                                            value: 'jupiter',
                                            label: 'Jupiter',
                                            expanded: true,
                                            children: [
                                                {
                                                    value: 'io',
                                                    label: 'Io',
                                                    checked: true,
                                                },
                                                { value: 'europa', label: 'Europa' },
                                            ],
                                        },
                                    ],
                                },
                            ]}
                            onCheck={(nodeKey, treeModel) => {
                                actual = treeModel.getChecked();
                            }}
                        />
                    </CheckboxTreeProvider>,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Europa'));

                assert.deepEqual(actual, ['sol', 'mercury', 'jupiter', 'io', 'europa']);
            });

            it('parent.checkState should equal 2 if not all leaves are checked', async () => {
                let actual = null;

                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            checkModel="all"
                            nodes={[
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    expanded: true,
                                    children: [
                                        { value: 'io', label: 'Io' },
                                        { value: 'europa', label: 'Europa' },
                                    ],
                                },
                            ]}
                            onCheck={(nodeKey, treeModel) => {
                                const node = treeModel.getNode('jupiter');
                                actual = node.checkState;
                            }}
                        />
                    </CheckboxTreeProvider>,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Europa'));

                assert.equal(actual, 2);
            });
        });

        describe('leaf', () => {
            it('should only record leaf nodes in the checked array', async () => {
                let actual = null;

                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            nodes={[
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    children: [
                                        { value: 'io', label: 'Io' },
                                        { value: 'europa', label: 'Europa' },
                                    ],
                                },
                            ]}
                            onCheck={(nodeKey, treeModel) => {
                                actual = treeModel.getChecked();
                            }}
                        />
                    </CheckboxTreeProvider>,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Jupiter'));

                assert.deepEqual(actual, ['io', 'europa']);
            });
        });
    });

    describe('checkKeys', () => {
        it('should trigger a check event when pressing one of the supplied values', async () => {
            let actual = null;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        checkKeys={['Shift']}
                        checked={[]}
                        nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                        onCheck={(nodeKey, treeModel) => {
                            actual = treeModel.getChecked();
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            await fireEvent.keyUp(screen.getByRole('checkbox'), { key: 'Shift' });

            assert.deepEqual(actual, ['jupiter']);
        });
    });

    describe('direction', () => {
        it('should add the class rct-direction-rtl to the root when set to `rtl`', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        direction="rtl"
                        nodes={[]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree.rct-direction-rtl'));
        });
    });

    describe('disabled', () => {
        it('should add the class rct-disabled to the root', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        disabled
                        nodes={[]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree.rct-disabled'));
        });
    });

    describe('icons', () => {
        it('should pass the property directly to tree nodes', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        icons={{ check: <span className="other-check" /> }}
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                checked: true,
                            },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(container.querySelector('.rct-checkbox > .other-check'));
        });

        it('should be merged in with the defaults when keys are missing', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        icons={{ check: <span className="other-check" /> }}
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                            },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(container.querySelector('.rct-checkbox > .rct-icon-uncheck'));
        });

        it('should not render the wrapper element when an icon is set to null', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        icons={{ leaf: null }}
                        nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNull(container.querySelector('.rct-node-icon'));
        });
    });

    describe('iconsClass', () => {
        it('should apply the specified icon style to the tree', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        iconsClass="some-class"
                        nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isTrue(container.querySelector('.react-checkbox-tree').classList.contains('rct-icons-some-class'));
        });
    });

    describe('id', () => {
        it('should pass the id to the top-level DOM node', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        id="my-awesome-id"
                        nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.equal(container.querySelector('.react-checkbox-tree').id, 'my-awesome-id');
        });

        it('should pass the id as a property directly to tree nodes', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        id="my-awesome-id"
                        nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.equal(screen.getByRole('checkbox').id, 'my-awesome-id-jupiter');
        });
    });

    describe('lang', () => {
        it('should override default language values', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        lang={{
                            expandAll: 'Expand all of it',
                            expandNode: 'Expand it',
                            collapseAll: 'Collapse all of it',
                            collapseNode: 'Collapse it',
                        }}
                        nodes={[]}
                        showExpandAll
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(screen.queryByLabelText('Expand all of it'));
        });
    });

    describe('nativeCheckboxes', () => {
        it('should add the class `rct-native-display` to the root', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree nativeCheckboxes nodes={[]} />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree.rct-native-display'));
        });
    });

    describe('nodes', () => {
        afterEach(() => {
            // Restore console error
            console.error = consoleError;
        });

        it('should render the node\'s label', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(screen.queryByLabelText('Jupiter'));
        });

        it('should render the node\'s value', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        id="id"
                        nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.equal(screen.getByRole('checkbox').id, 'id-jupiter');
        });

        it('should render multiple nodes', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        id="id"
                        nodes={[
                            { value: 'jupiter', label: 'Jupiter' },
                            { value: 'saturn', label: 'Saturn' },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-jupiter');
            assert.equal(screen.getByLabelText('Saturn').id, 'id-saturn');
        });

        it('should render child nodes', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                expanded: true,
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(screen.queryByLabelText('Io'));
            assert.isNotNull(screen.queryByLabelText('Europa'));
        });

        it('should render a node with no `children` array as a leaf', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            { value: 'jupiter', label: 'Jupiter' },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            const { classList } = container.querySelector('.rct-node');

            assert.isFalse(classList.contains('rct-node-parent'));
            assert.isTrue(classList.contains('rct-node-leaf'));
        });

        it('should render a node with an empty `children` array as a parent', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [],
                            },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            const { classList } = container.querySelector('.rct-node');

            assert.isTrue(classList.contains('rct-node-parent'));
            assert.isFalse(classList.contains('rct-node-leaf'));
        });

        // https://github.com/jakezatecky/react-checkbox-tree/issues/258
        it('should render a node with an empty `children` array as unchecked by default', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [],
                            },
                        ]}
                    />
                </CheckboxTreeProvider>,
            );

            assert.isFalse(screen.getByRole('checkbox').checked);
        });

        it('should throw an error when duplicate values are used in the same children array', async () => {
            // Suppress caught errors from React
            console.error = () => {};

            let errorMessage = '';

            try {
                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            nodes={[
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    expanded: true,
                                    children: [
                                        { value: 'io', label: 'Io' },
                                        { value: 'io', label: 'Europa' },
                                    ],
                                },
                            ]}
                        />
                    </CheckboxTreeProvider>,
                );
            } catch (e) {
                if (e instanceof TreeModelError) {
                    errorMessage = e.message;
                } else {
                    throw e;
                }
            }

            assert.equal(errorMessage, "Duplicate value 'io' detected. All node values must be unique.");
        });

        it('should throw an error when duplicate values are used in different levels of the tree', async () => {
            // Suppress caught errors from React
            console.error = () => {};

            let errorMessage = '';

            try {
                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            nodes={[
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    children: [
                                        { value: 'jupiter', label: 'Jupiter' },
                                    ],
                                },
                            ]}
                        />
                    </CheckboxTreeProvider>,
                );
            } catch (e) {
                if (e instanceof TreeModelError) {
                    errorMessage = e.message;
                } else {
                    throw e;
                }
            }

            assert.equal(errorMessage, "Duplicate value 'jupiter' detected. All node values must be unique.");
        });
    });

    describe('noCascadeChecks', () => {
        it('should not toggle the check state of children when set to true', async () => {
            let actual = null;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        checkModel="all"
                        noCascadeChecks
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onCheck={(nodeKey, treeModel) => {
                            actual = treeModel.getChecked();
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actual, ['jupiter']);
        });

        it('should toggle the check state of children when set to false', async () => {
            let actual = null;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onCheck={(nodeKey, treeModel) => {
                            actual = treeModel.getChecked();
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actual, ['io', 'europa']);
        });
    });

    describe('nodeProps', () => {
        describe('disabled', () => {
            it('should disable the target node when set to true', () => {
                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            nodes={[
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    disabled: true,
                                    children: [
                                        { value: 'europa', label: 'Europa' },
                                    ],
                                },
                            ]}
                        />
                    </CheckboxTreeProvider>,
                );

                assert.isTrue(screen.getByLabelText('Jupiter').disabled);
            });

            it('should disable the child nodes when `noCascadeDisabled` is false', () => {
                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            nodes={[
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    disabled: true,
                                    expanded: true,
                                    children: [
                                        { value: 'europa', label: 'Europa' },
                                    ],
                                },
                            ]}
                        />
                    </CheckboxTreeProvider>,
                );

                assert.isTrue(screen.getByLabelText('Europa').disabled);
            });

            it('should NOT disable the child nodes when `noCascadeDisabled` is true', () => {
                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            noCascadeDisabled
                            nodes={[
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    disabled: true,
                                    expanded: true,
                                    children: [
                                        { value: 'europa', label: 'Europa' },
                                    ],
                                },
                            ]}
                        />
                    </CheckboxTreeProvider>,
                );

                assert.isFalse(screen.getByLabelText('Europa').disabled);
            });

            // https://github.com/jakezatecky/react-checkbox-tree/issues/119
            it('should be able to change disabled state after the initial render', () => {
                const nodes = [
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        expanded: true,
                        children: [
                            { value: 'europa', label: 'Europa' },
                        ],
                    },
                ];
                const { rerender } = render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            disabled
                            nodes={nodes}
                        />
                    </CheckboxTreeProvider>,
                );

                rerender(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            nodes={nodes}
                        />
                    </CheckboxTreeProvider>,
                );

                assert.isFalse(screen.getByLabelText('Europa').disabled);
            });
        });
    });

    describe('onlyLeafCheckboxes', () => {
        it('should only render checkboxes for leaf nodes', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                expanded: true,
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onlyLeafCheckboxes
                    />
                </CheckboxTreeProvider>,

            );

            assert.isNull(screen.queryByLabelText('Jupiter'));
            assert.isNotNull(screen.queryByLabelText('Io'));
            assert.isNotNull(screen.queryByLabelText('Europa'));
        });
    });

    describe('showExpandAll', () => {
        it('should render the expand all/collapse all buttons', () => {
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                        showExpandAll
                    />
                </CheckboxTreeProvider>,
            );

            assert.isNotNull(screen.queryByLabelText('Expand all'));
            assert.isNotNull(screen.queryByLabelText('Collapse all'));
        });

        describe('expandAll', () => {
            it('should add all parent nodes to the `expanded` array', async () => {
                let actualExpanded = null;

                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            nodes={[
                                {
                                    value: 'mercury',
                                    label: 'Mercury',
                                },
                                {
                                    value: 'mars',
                                    label: 'Mars',
                                    children: [
                                        { value: 'phobos', label: 'Phobos' },
                                        { value: 'deimos', label: 'Deimos' },
                                    ],
                                },
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    children: [
                                        { value: 'io', label: 'Io' },
                                        { value: 'europa', label: 'Europa' },
                                    ],
                                },
                            ]}
                            showExpandAll
                            onExpand={(nodeKey, treeModel) => {
                                actualExpanded = treeModel.getExpanded();
                            }}
                        />
                    </CheckboxTreeProvider>,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Expand all'));

                assert.deepEqual(actualExpanded, ['mars', 'jupiter']);
            });
        });

        describe('collapseAll', () => {
            it('should remove all nodes from the `expanded` array', async () => {
                let actualExpanded = null;

                render(
                    <CheckboxTreeProvider>
                        <CheckboxTree
                            expanded={['mars', 'jupiter']}
                            nodes={[
                                {
                                    value: 'mercury',
                                    label: 'Mercury',
                                },
                                {
                                    value: 'mars',
                                    label: 'Mars',
                                    children: [
                                        { value: 'phobos', label: 'Phobos' },
                                        { value: 'deimos', label: 'Deimos' },
                                    ],
                                },
                                {
                                    value: 'jupiter',
                                    label: 'Jupiter',
                                    children: [
                                        { value: 'io', label: 'Io' },
                                        { value: 'europa', label: 'Europa' },
                                    ],
                                },
                            ]}
                            showExpandAll
                            onExpand={(nodeKey, treeModel) => {
                                actualExpanded = treeModel.getExpanded();
                            }}
                        />
                    </CheckboxTreeProvider>,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Collapse all'));

                assert.deepEqual(actualExpanded, []);
            });
        });
    });

    describe('showNodeTitle', () => {
        it('should add `title` properties to a TreeNode from the `label` property when set', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                            },
                        ]}
                        showNodeTitle
                    />
                </CheckboxTreeProvider>,
            );

            assert.equal(container.querySelector('label').title, 'Jupiter');
        });

        it('should prioritize the node `title` over the `label', () => {
            const { container } = render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                title: 'That Big Failed Star',
                            },
                        ]}
                        showNodeTitle
                    />
                </CheckboxTreeProvider>,
            );

            assert.equal(container.querySelector('label').title, 'That Big Failed Star');
        });
    });

    describe('onCheck', () => {
        it('should add all children of the checked parent to the checked array', async () => {
            let actualChecked = null;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onCheck={(nodeKey, treeModel) => {
                            actualChecked = treeModel.getChecked();
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actualChecked, ['io', 'europa']);
        });

        // https://github.com/jakezatecky/react-checkbox-tree/issues/258
        it('should toggle a node with an empty `children` array', async () => {
            let actualChecked = {};
            const makeEmptyParentNode = (nodes) => (
                <CheckboxTreeProvider>
                    <CheckboxTree
                        checkModel="all"
                        nodes={nodes}
                        onCheck={(nodeKey, treeModel) => {
                            actualChecked = treeModel.getChecked();
                        }}
                    />
                </CheckboxTreeProvider>
            );

            const user = userEvent.setup();

            // Unchecked to checked
            const { rerender } = render(makeEmptyParentNode([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    children: [],
                },
            ]));
            await user.click(screen.getByRole('checkbox'));
            assert.deepEqual(actualChecked, ['jupiter']);

            // Checked to unchecked
            rerender(makeEmptyParentNode([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    checked: true,
                    children: [],
                },
            ]));
            await user.click(screen.getByRole('checkbox'));
            assert.deepEqual(actualChecked, []);
        });

        it('should not add disabled children to the checked array', async () => {
            let actualChecked = null;
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io', disabled: true },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onCheck={(nodeKey, treeModel) => {
                            actualChecked = treeModel.getChecked();
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actualChecked, ['europa']);
        });

        it('should pass the node.value of the clicked node as the first parameter', async () => {
            let actual = '';

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onCheck={(nodeKey) => {
                            actual = nodeKey;
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.equal(actual, 'jupiter');
        });

        it('should pass the TreeModel instance as the second parameter', async () => {
            let actual = false;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onCheck={(nodeKey, treeModel) => {
                            actual = treeModel instanceof TreeModel;
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.equal(actual, true);
        });
    });

    describe('onClick', () => {
        it('should pass the nodeKey(node.value) of the node clicked as the first parameter', async () => {
            let actualNode = null;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onClick={(nodeKey, treeModel) => {
                            const node = treeModel.getNode(nodeKey);
                            actualNode = node;
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByText('Jupiter'));

            assert.equal(actualNode.value, 'jupiter');
        });
    });

    describe('onContextMenu', () => {
        it('should provide the target node\'s information when right-clicking a label', async () => {
            let actualNode = null;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onContextMenu={(event, node) => {
                            actualNode = node;
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.pointer({
                target: screen.getByText('Jupiter'),
                keys: '[MouseRight]',
            });

            assert.equal(actualNode.value, 'jupiter');
            assert.isFalse(actualNode.expanded);
        });
    });

    describe('onExpand', () => {
        it('should toggle the expansion state of the target node', async () => {
            let actualExpanded = null;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onExpand={(nodeKey, treeModel) => {
                            actualExpanded = treeModel.getExpanded();
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Expand node'));

            assert.deepEqual(actualExpanded, ['jupiter']);
        });

        it('should pass the node.value of the clicked node as the first parameter', async () => {
            let actual = '';

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onExpand={(nodeKey) => {
                            actual = nodeKey;
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Expand node'));

            assert.equal(actual, 'jupiter');
        });

        it('should pass the TreeModel instance as the second parameter', async () => {
            let actual = false;

            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'io', label: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onExpand={(nodeKey, treeModel) => {
                            actual = treeModel instanceof TreeModel;
                        }}
                    />
                </CheckboxTreeProvider>,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Expand node'));

            assert.equal(actual, true);
        });
    });

    describe('handler.targetNode', () => {
        it('should supply a variety of metadata relating to the target node', async () => {
            let checkNode = null;
            let expandNode = null;
            let clickNode = null;

            const getNodeMetadata = (node) => {
                const {
                    value,
                    label,
                    title,
                    childKeys,
                    expanded,
                    checkState,
                    parentKey,
                    isChild,
                    isParent,
                    isLeaf,
                    isRadioGroup,
                    isRadioNode,
                    isHiddenByFilter,
                    disabled,
                    icon,
                    showCheckbox,
                    index,
                    treeDepth,
                } = node;

                return {
                    value,
                    label,
                    title,
                    childKeys,
                    expanded,
                    checkState,
                    parentKey,
                    isChild,
                    isParent,
                    isLeaf,
                    isRadioGroup,
                    isRadioNode,
                    isHiddenByFilter,
                    disabled,
                    icon,
                    showCheckbox,
                    index,
                    treeDepth,
                };
            };
            render(
                <CheckboxTreeProvider>
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                expanded: true,
                                children: [
                                    { value: 'io', label: 'Io', title: 'Io' },
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                        onCheck={(nodeKey, treeModel) => {
                            checkNode = treeModel.getNode(nodeKey);
                        }}
                        onClick={(nodeKey, treeModel) => {
                            clickNode = treeModel.getNode(nodeKey);
                        }}
                        onExpand={(nodeKey, treeModel) => {
                            expandNode = treeModel.getNode(nodeKey);
                        }}
                    />
                </CheckboxTreeProvider>,
            );
            const expectedLeafMetadata = {
                value: 'io',
                label: 'Io',
                title: 'Io',
                childKeys: null,
                expanded: false,
                checkState: 1,
                parentKey: 'jupiter',
                isChild: true,
                isParent: false,
                isLeaf: true,
                isRadioGroup: false,
                isRadioNode: false,
                isHiddenByFilter: false,
                disabled: false,
                icon: null,
                showCheckbox: true,
                index: 0,
                treeDepth: 1,
            };
            const expectedParentMetadata = {
                value: 'jupiter',
                label: 'Jupiter',
                title: undefined,
                childKeys: ['io', 'europa'],
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

            const user = userEvent.setup();

            // onCheck
            await user.click(screen.getByTitle('Io'));
            assert.deepEqual(getNodeMetadata(checkNode), expectedLeafMetadata);

            // onClick
            await user.click(screen.getByText('Io'));
            assert.deepEqual(getNodeMetadata(clickNode), expectedLeafMetadata);

            // onExpand
            await user.click(screen.getByLabelText('Collapse node'));
            assert.deepEqual(getNodeMetadata(expandNode), expectedParentMetadata);
        });
    });
});
