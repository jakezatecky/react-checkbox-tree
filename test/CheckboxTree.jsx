import React from 'react';
import { assert } from 'chai';
import { render, screen } from '@testing-library/react';
import { configure, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import CheckboxTree from '../src/js/CheckboxTree';
// import CheckboxTreeError from '../src/js/CheckboxTreeError';
import TreeModel from '../src/js/models/TreeModel';
import TreeModelError from '../src/js/models/TreeModelError';

const consoleError = console.error;

const test1 = [
    {
        label: 'Saturn',
        value: 'saturn',
    },
];

const test2 = [
    {
        label: 'Jupiter',
        value: 'jupiter',
        expanded: true,
        children: [
            { value: 'io', label: 'Io' },
            { value: 'europa', label: 'Europa' },
        ],
    }, {
        label: 'Saturn',
        value: 'saturn',
        checked: true,
        expanded: true,
        children: [
            { value: 'titan', label: 'Titan', checked: true },
            { value: 'enceladus', label: 'Enceladus', checked: true },
        ],
    }, {
        label: 'Earth',
        value: 'earth',
        children: [
            { value: 'moon', label: 'Moon' },
        ],
    },
];

const test3 = [
    {
        label: 'Earth',
        value: 'earth',
        expanded: true,
        children: [
            { value: 'moon', label: 'Moon' },
        ],
    },
];

const test4 = [
    {
        label: 'Saturn',
        value: 'saturn',
        expanded: true,
        children: [
            { value: 'titan', label: 'Titan' },
            { value: 'enceladus', label: 'Enceladus' },
        ],
    },
];

const tree1 = new TreeModel(test1);
const tree2 = new TreeModel(test2);
const tree3 = new TreeModel(test3);
const tree4 = new TreeModel(test4);

// Increase waitFor timeout to prevent unusual issues when there are many tests
configure({
    asyncUtilTimeout: 10000,
});

describe('<CheckboxTree />', () => {
    describe('component', () => {
        it('should render the react-checkbox-tree container', () => {
            const { container } = render(
                <CheckboxTree
                    tree={tree1}
                    onChange={() => {}}
                />,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree'));
        });

        it('should rerender using the tree prop if that prop has changed', () => {
            const { rerender } = render(
                <CheckboxTree
                    tree={tree2}
                    onChange={() => {}}
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Jupiter'));

            rerender(
                <CheckboxTree
                    tree={tree3}
                    onChange={() => {}}
                />,
            );

            assert.isNull(screen.queryByLabelText('Jupiter'));
            assert.isNotNull(screen.queryByLabelText('Earth'));
        });
    });

    describe('checkModel', () => {
        describe('all', () => {
            it('should return checked parent and leaf nodes', async () => {
                let actual = null;
                let tree = tree2.updateOptions({
                    checkModel: 'all',
                });

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                        onCheck={(node, newTree) => {
                            actual = newTree.getChecked();
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Jupiter'));

                assert.deepEqual(actual, ['jupiter', 'io', 'europa', 'saturn', 'titan', 'enceladus']);
            });

            it('should percolate `checked` to all parents and grandparents if all leaves are checked', async () => {
                // TODO: this needs a deeper test
                let actual = null;
                let tree = tree3.updateOptions({
                    checkModel: 'all',
                });

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                        onCheck={(node, treeModel) => {
                            actual = treeModel.getChecked();
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Moon'));

                assert.deepEqual(actual, ['earth', 'moon']);
            });

            it('parent.checkState should equal 2 if not all leaves are checked', async () => {
                let actual = null;
                let tree = tree4.updateOptions({
                    checkModel: 'all',
                });

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                        onCheck={(node, treeModel) => {
                            const parentNode = treeModel.getNode('saturn');
                            actual = parentNode.checkState;
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Enceladus'));

                assert.equal(actual, 2);
            });
        });

        describe('leaf', () => {
            it('should only record leaf nodes in the checked array', async () => {
                let actual = null;
                let tree = tree2;

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                        onCheck={(nodeKey, newTree) => {
                            actual = newTree.getChecked();
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Jupiter'));

                assert.deepEqual(actual, ['io', 'europa', 'titan', 'enceladus']);
            });
        });
    });

    describe('checkKeys', () => {
        it('should trigger a check event when pressing one of the supplied values', async () => {
            let actual = null;
            let tree = tree1;

            render(
                <CheckboxTree
                    checkKeys={['Shift']}
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(nodeKey, treeModel) => {
                        actual = treeModel.getChecked();
                    }}
                />,
            );

            await fireEvent.keyUp(screen.getByRole('checkbox'), { key: 'Shift' });

            assert.deepEqual(actual, ['saturn']);
        });
    });

    describe('direction', () => {
        it('should add the class rct-direction-rtl to the root when set to `rtl`', () => {
            let tree = tree1;

            const { container } = render(
                <CheckboxTree
                    direction="rtl"
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree.rct-direction-rtl'));
        });
    });

    describe('disabled', () => {
        it('should add the class rct-disabled to the root', () => {
            let tree = tree1;

            const { container } = render(
                <CheckboxTree
                    disabled
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree.rct-disabled'));
        });
    });

    describe('icons', () => {
        it('should pass the property directly to tree nodes', () => {
            let tree = tree1;
            tree = tree.toggleChecked('saturn');
            const { container } = render(
                <CheckboxTree
                    icons={{ check: <span className="other-check" /> }}
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNotNull(container.querySelector('.rct-checkbox > .other-check'));
        });

        it('should be merged in with the defaults when keys are missing', () => {
            let tree = tree1;
            const { container } = render(
                <CheckboxTree
                    icons={{ check: <span className="other-check" /> }}
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNotNull(container.querySelector('.rct-checkbox > .rct-icon-uncheck'));
        });

        it('should not render the wrapper element when an icon is set to null', () => {
            let tree = tree1;
            const { container } = render(
                <CheckboxTree
                    icons={{ leaf: null }}
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNull(container.querySelector('.rct-node-icon'));
        });
    });

    describe('iconsClass', () => {
        it('should apply the specified icon style to the tree', () => {
            let tree = tree1;
            const { container } = render(
                <CheckboxTree
                    iconsClass="some-class"
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isTrue(container.querySelector('.react-checkbox-tree').classList.contains('rct-icons-some-class'));
        });
    });

    describe('id', () => {
        it('should pass the id to the top-level DOM node', () => {
            let tree = tree1;
            const { container } = render(
                <CheckboxTree
                    id="my-awesome-id"
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.equal(container.querySelector('.react-checkbox-tree').id, 'my-awesome-id');
        });

        it('should pass the id as a property directly to tree nodes', () => {
            let tree = tree1;
            render(
                <CheckboxTree
                    id="my-awesome-id"
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.equal(screen.getByRole('checkbox').id, 'my-awesome-id-saturn');
        });
    });

    describe('lang', () => {
        it('should override default language values', () => {
            let tree = tree1;
            render(
                <CheckboxTree
                    lang={{
                        expandAll: 'Expand all of it',
                        expandNode: 'Expand it',
                        collapseAll: 'Collapse all of it',
                        collapseNode: 'Collapse it',
                    }}
                    showExpandAll
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Expand all of it'));
        });
    });

    describe('nativeCheckboxes', () => {
        it('should add the class `rct-native-display` to the root', () => {
            let tree = tree1;
            const { container } = render(
                <CheckboxTree
                    nativeCheckboxes
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
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
            let tree = tree1;
            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Saturn'));
        });

        it('should render the node\'s value', () => {
            let tree = tree1;
            render(
                <CheckboxTree
                    id="id"
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.equal(screen.getByRole('checkbox').id, 'id-saturn');
        });

        it('should render multiple nodes', () => {
            let tree = tree2;
            render(
                <CheckboxTree
                    id="id"
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-jupiter');
            assert.equal(screen.getByLabelText('Saturn').id, 'id-saturn');
        });

        it('should render child nodes', () => {
            let tree = tree2;
            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Io'));
            assert.isNotNull(screen.queryByLabelText('Europa'));
        });

        it('should render a node with no `children` array as a leaf', () => {
            let tree = tree1;
            const { container } = render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            const { classList } = container.querySelector('.rct-node');

            assert.isFalse(classList.contains('rct-node-parent'));
            assert.isTrue(classList.contains('rct-node-leaf'));
        });

        it('should render a node with an empty `children` array as a parent', () => {
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    children: [],
                },
            ]);

            const { container } = render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            const { classList } = container.querySelector('.rct-node');

            assert.isTrue(classList.contains('rct-node-parent'));
            assert.isFalse(classList.contains('rct-node-leaf'));
        });

        // https://github.com/jakezatecky/react-checkbox-tree/issues/258
        it('should render a node with an empty `children` array as unchecked by default', () => {
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    children: [],
                },
            ]);

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isFalse(screen.getByRole('checkbox').checked);
        });

        it('should throw an error when duplicate values are used in the same children array', async () => {
            // Suppress caught errors from React
            console.error = () => {};

            let errorMessage = '';

            try {
                let tree = new TreeModel([
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        expanded: true,
                        children: [
                            { value: 'io', label: 'Io' },
                            { value: 'io', label: 'Europa' },
                        ],
                    },
                ]);

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                    />,
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
                let tree = new TreeModel([
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        children: [
                            { value: 'jupiter', label: 'Jupiter' },
                        ],
                    },
                ]);

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                    />,
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
            let tree = tree4.updateOptions({
                checkModel: 'all',
                noCascadeChecks: true,
            });

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(nodeKey, treeModel) => {
                        actual = treeModel.getChecked();
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Saturn'));

            assert.deepEqual(actual, ['saturn']);
        });

        it('should toggle the check state of children when set to false', async () => {
            let actual = null;
            let tree = tree4;

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(nodeKey, treeModel) => {
                        actual = treeModel.getChecked();
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Saturn'));

            assert.deepEqual(actual, ['titan', 'enceladus']);
        });
    });

    describe('nodeProps', () => {
        describe('disabled', () => {
            it('should disable the target node when set to true', () => {
                let tree = new TreeModel([
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        disabled: true,
                        children: [
                            { value: 'europa', label: 'Europa' },
                        ],
                    },
                ]);

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                    />,
                );

                assert.isTrue(screen.getByLabelText('Jupiter').disabled);
            });

            it('should disable the child nodes when `disabledCascade` is true', () => {
                let tree = new TreeModel([
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        disabled: true,
                        expanded: true,
                        children: [
                            { value: 'europa', label: 'Europa' },
                        ],
                    },
                ]);

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                    />,
                );

                assert.isTrue(screen.getByLabelText('Europa').disabled);
            });

            it('should NOT disable the child nodes when `disabledCascade` is false', () => {
                // TODO: figure out about TreeModel options
                let tree = new TreeModel([
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        disabled: true,
                        expanded: true,
                        children: [
                            { value: 'europa', label: 'Europa' },
                        ],
                    },
                ], { disabledCascade: false });

                render(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                    />,
                );

                assert.isFalse(screen.getByLabelText('Europa').disabled);
            });

            // https://github.com/jakezatecky/react-checkbox-tree/issues/119
            it('should be able to change disabled state after the initial render', () => {
                let tree = new TreeModel([
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        expanded: true,
                        children: [
                            { value: 'europa', label: 'Europa' },
                        ],
                    },
                ]);

                const { rerender } = render(
                    <CheckboxTree
                        disabled
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                    />,
                );

                rerender(
                    <CheckboxTree
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                    />,
                );

                assert.isFalse(screen.getByLabelText('Europa').disabled);
            });
        });
    });

    describe('onlyLeafCheckboxes', () => {
        it('should only render checkboxes for leaf nodes', () => {
            let tree = tree2;
            render(
                <CheckboxTree
                    onlyLeafCheckboxes
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNull(screen.queryByLabelText('Jupiter'));
            assert.isNotNull(screen.queryByLabelText('Io'));
            assert.isNotNull(screen.queryByLabelText('Europa'));
        });
    });

    describe('showExpandAll', () => {
        it('should render the expand all/collapse all buttons', () => {
            let tree = tree1;

            render(
                <CheckboxTree
                    showExpandAll
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Expand all'));
            assert.isNotNull(screen.queryByLabelText('Collapse all'));
        });

        describe('expandAll', () => {
            it('should add all parent nodes to the `expanded` array', async () => {
                let actualExpanded = null;
                let tree = new TreeModel([
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
                ]);

                render(
                    <CheckboxTree
                        showExpandAll
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                        onExpand={(nodeKey, treeModel) => {
                            actualExpanded = treeModel.getExpanded();
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Expand all'));

                // TODO: onExpand is not called by expandAll
                actualExpanded = tree.getExpanded();

                assert.deepEqual(actualExpanded, ['mars', 'jupiter']);
            });
        });

        describe('collapseAll', () => {
            it('should remove all nodes from the `expanded` array', async () => {
                let actualExpanded = null;
                let tree = tree2;

                render(
                    <CheckboxTree
                        showExpandAll
                        tree={tree}
                        onChange={(newTree) => {
                            tree = newTree;
                        }}
                        onExpand={(nodeKey, treeModel) => {
                            actualExpanded = treeModel.getExpanded();
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Collapse all'));

                // TODO: onExpand is not called by collapseAll
                actualExpanded = tree.getExpanded();

                assert.deepEqual(actualExpanded, []);
            });
        });
    });

    describe('showNodeTitle', () => {
        it('should add `title` properties to a TreeNode from the `label` property when set', () => {
            let tree = tree1;

            const { container } = render(
                <CheckboxTree
                    showNodeTitle
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.equal(container.querySelector('label').title, 'Saturn');
        });

        it('should prioritize the node `title` over the `label', () => {
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    title: 'That Big Failed Star',
                },
            ]);

            const { container } = render(
                <CheckboxTree
                    showNodeTitle
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                />,
            );

            assert.equal(container.querySelector('label').title, 'That Big Failed Star');
        });
    });

    describe('onCheck', () => {
        it('should add all children of the checked parent to the checked array', async () => {
            let actualChecked = null;
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    children: [
                        { value: 'io', label: 'Io' },
                        { value: 'europa', label: 'Europa' },
                    ],
                },
            ]);

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(nodeKey, treeModel) => {
                        actualChecked = treeModel.getChecked();
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actualChecked, ['io', 'europa']);
        });

        // https://github.com/jakezatecky/react-checkbox-tree/issues/258
        it('should toggle a node with an empty `children` array', async () => {
            let actualChecked = [];
            let tree = new TreeModel(
                [
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        children: [],
                    },
                ],
                {
                    checkModel: 'all',
                },
            );

            // Unchecked to checked
            const { rerender } = render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(nodeKey, treeModel) => {
                        actualChecked = treeModel.getChecked();
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByRole('checkbox'));

            assert.deepEqual(actualChecked, ['jupiter']);

            // Checked to unchecked
            rerender(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(nodeKey, treeModel) => {
                        actualChecked = treeModel.getChecked();
                    }}
                />,
            );

            await user.click(screen.getByRole('checkbox'));
            assert.deepEqual(actualChecked, []);
        });

        it('should not add disabled children to the checked array', async () => {
            let actualChecked = null;
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    children: [
                        { value: 'io', label: 'Io', disabled: true },
                        { value: 'europa', label: 'Europa' },
                    ],
                },
            ]);
            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(nodeKey, treeModel) => {
                        actualChecked = treeModel.getChecked();
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actualChecked, ['europa']);
        });

        it('should pass the node of the clicked node as the first parameter', async () => {
            let actual = '';
            let tree = tree2;

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(node) => {
                        actual = node.value;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.equal(actual, 'jupiter');
        });

        it('should pass the TreeModel instance as the second parameter', async () => {
            let actual = false;
            let tree = tree2;

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(nodeKey, treeModel) => {
                        actual = treeModel instanceof TreeModel;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.equal(actual, true);
        });
    });

    describe('onClick', () => {
        it('should pass the node clicked as the first parameter', async () => {
            let actualNode = null;
            let tree = tree2;

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(node) => {
                        actualNode = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByText('Jupiter'));

            assert.equal(actualNode.value, 'jupiter');
        });
    });

    describe('onContextMenu', () => {
        it('should provide the target node\'s information when right-clicking a label', async () => {
            let actualNode = null;
            let tree = tree2;

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onContextMenu={(event, node) => {
                        actualNode = node;
                    }}
                />,
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
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    children: [
                        { value: 'io', label: 'Io' },
                        { value: 'europa', label: 'Europa' },
                    ],
                },
            ]);

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onExpand={(nodeKey, treeModel) => {
                        actualExpanded = treeModel.getExpanded();
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Expand node'));

            assert.deepEqual(actualExpanded, ['jupiter']);
        });

        it('should pass the node.value of the clicked node as the first parameter', async () => {
            let actual = '';
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    children: [
                        { value: 'io', label: 'Io' },
                        { value: 'europa', label: 'Europa' },
                    ],
                },
            ]);

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onExpand={(node) => {
                        actual = node.value;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Expand node'));

            assert.equal(actual, 'jupiter');
        });

        it('should pass the TreeModel instance as the second parameter', async () => {
            let actual = false;
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    children: [
                        { value: 'io', label: 'Io' },
                        { value: 'europa', label: 'Europa' },
                    ],
                },
            ]);

            render(
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onExpand={(nodeKey, treeModel) => {
                        actual = treeModel instanceof TreeModel;
                    }}
                />,
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
            let tree = new TreeModel([
                {
                    value: 'jupiter',
                    label: 'Jupiter',
                    expanded: true,
                    children: [
                        { value: 'io', label: 'Io', title: 'Io' },
                        { value: 'europa', label: 'Europa' },
                    ],
                },
            ]);

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
                <CheckboxTree
                    tree={tree}
                    onChange={(newTree) => {
                        tree = newTree;
                    }}
                    onCheck={(node) => {
                        checkNode = node;
                    }}
                    onClick={(node) => {
                        clickNode = node;
                    }}
                    onExpand={(node) => {
                        expandNode = node;
                    }}
                />,
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
                checkState: 0,
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

            // first click makes checked true
            expectedLeafMetadata.checkState = 1;
            assert.deepEqual(getNodeMetadata(checkNode), expectedLeafMetadata);

            // onClick
            await user.click(screen.getByText('Io'));
            // second click makes checked false
            expectedLeafMetadata.checkState = 0;

            assert.deepEqual(getNodeMetadata(clickNode), expectedLeafMetadata);

            // onExpand
            await user.click(screen.getByLabelText('Collapse node'));
            assert.deepEqual(getNodeMetadata(expandNode), expectedParentMetadata);
        });
    });
});
