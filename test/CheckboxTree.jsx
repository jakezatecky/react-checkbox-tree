import React from 'react';
import { assert } from 'chai';
import { render, screen } from '@testing-library/react';
import { configure, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import CheckboxTree from '../src/js/CheckboxTree';
import CheckboxTreeError from '../src/js/CheckboxTreeError';

const consoleError = console.error;

// Increase waitFor timeout to prevent unusual issues when there are many tests
configure({
    asyncUtilTimeout: 10000,
});

describe('<CheckboxTree />', () => {
    describe('component', () => {
        it('should render the react-checkbox-tree container', () => {
            const { container } = render(
                <CheckboxTree
                    nodes={[]}
                    onCheck={() => {}}
                    onExpand={() => {}}
                />,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree'));
        });
    });

    describe('checkModel', () => {
        describe('all', () => {
            it('should record checked parent and leaf nodes', async () => {
                let actual = null;

                render(
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
                        onCheck={(checked) => {
                            actual = checked;
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Jupiter'));

                assert.deepEqual(actual, ['jupiter', 'io', 'europa']);
            });

            it('should percolate `checked` to all parents and grandparents if all leaves are checked', async () => {
                let actual = null;

                render(
                    <CheckboxTree
                        checkModel="all"
                        checked={['mercury', 'io']}
                        expanded={['sol', 'jupiter']}
                        nodes={[
                            {
                                value: 'sol',
                                label: 'Sol System',
                                children: [
                                    { value: 'mercury', label: 'Mercury' },
                                    {
                                        value: 'jupiter',
                                        label: 'Jupiter',
                                        children: [
                                            { value: 'io', label: 'Io' },
                                            { value: 'europa', label: 'Europa' },
                                        ],
                                    },
                                ],
                            },
                        ]}
                        onCheck={(checked) => {
                            actual = checked;
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Europa'));

                assert.deepEqual(actual, ['sol', 'mercury', 'jupiter', 'io', 'europa']);
            });

            it('should NOT percolate `checked` to the parent if not all leaves are checked', async () => {
                let actual = null;

                render(
                    <CheckboxTree
                        checkModel="all"
                        expanded={['jupiter']}
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
                        onCheck={(checked) => {
                            actual = checked;
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByLabelText('Europa'));

                assert.deepEqual(actual, ['europa']);
            });
        });

        describe('leaf', () => {
            it('should only record leaf nodes in the checked array', async () => {
                let actual = null;

                render(
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
                        onCheck={(checked) => {
                            actual = checked;
                        }}
                    />,
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
                <CheckboxTree
                    checkKeys={['Shift']}
                    checked={[]}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    onCheck={(checked) => {
                        actual = checked;
                    }}
                />,
            );

            await fireEvent.keyUp(screen.getByRole('checkbox'), { key: 'Shift' });

            assert.deepEqual(actual, ['jupiter']);
        });
    });

    describe('checked', () => {
        // https://github.com/jakezatecky/react-checkbox-tree/issues/69
        it('should not throw an exception if it contains values that are not in the `nodes` property', () => {
            const { container } = render(
                <CheckboxTree
                    checked={['neptune']}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree'));
        });
    });

    describe('direction', () => {
        it('should add the class rct-direction-rtl to the root when set to `rtl`', () => {
            const { container } = render(
                <CheckboxTree direction="rtl" nodes={[]} />,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree.rct-direction-rtl'));
        });
    });

    describe('disabled', () => {
        it('should add the class rct-disabled to the root', () => {
            const { container } = render(
                <CheckboxTree disabled nodes={[]} />,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree.rct-disabled'));
        });
    });

    describe('expanded', () => {
        // https://github.com/jakezatecky/react-checkbox-tree/issues/69
        it('should not throw an exception if it contains values that are not in the `nodes` property', () => {
            const { container } = render(
                <CheckboxTree
                    expanded={['mars']}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isNotNull(container.querySelector('.react-checkbox-tree'));
        });
    });

    describe('icons', () => {
        it('should pass the property directly to tree nodes', () => {
            const { container } = render(
                <CheckboxTree
                    checked={['jupiter']}
                    icons={{ check: <span className="other-check" /> }}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isNotNull(container.querySelector('.rct-checkbox > .other-check'));
        });

        it('should be merged in with the defaults when keys are missing', () => {
            const { container } = render(
                <CheckboxTree
                    icons={{ check: <span className="other-check" /> }}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isNotNull(container.querySelector('.rct-checkbox > .rct-icon-uncheck'));
        });

        it('should not render the wrapper element when an icon is set to null', () => {
            const { container } = render(
                <CheckboxTree
                    icons={{ leaf: null }}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isNull(container.querySelector('.rct-node-icon'));
        });
    });

    describe('iconsClass', () => {
        it('should apply the specified icon style to the tree', () => {
            const { container } = render(
                <CheckboxTree
                    iconsClass="some-class"
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isTrue(container.querySelector('.react-checkbox-tree').classList.contains('rct-icons-some-class'));
        });
    });

    describe('id', () => {
        it('should pass the id to the top-level DOM node', () => {
            const { container } = render(
                <CheckboxTree
                    id="my-awesome-id"
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal(container.querySelector('.react-checkbox-tree').id, 'my-awesome-id');
        });

        it('should pass the id as a property directly to tree nodes', () => {
            render(
                <CheckboxTree
                    id="my-awesome-id"
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal(screen.getByRole('checkbox').id, 'my-awesome-id-jupiter');
        });
    });

    describe('lang', () => {
        it('should override default language values', () => {
            render(
                <CheckboxTree
                    lang={{
                        expandAll: 'Expand all of it',
                        expandNode: 'Expand it',
                        collapseAll: 'Collapse all of it',
                        collapseNode: 'Collapse it',
                    }}
                    nodes={[]}
                    showExpandAll
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Expand all of it'));
        });
    });

    describe('nativeCheckboxes', () => {
        it('should add the class `rct-native-display` to the root', () => {
            const { container } = render(
                <CheckboxTree nativeCheckboxes nodes={[]} />,
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
                <CheckboxTree
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Jupiter'));
        });

        it('should render the node\'s value', () => {
            render(
                <CheckboxTree
                    id="id"
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal(screen.getByRole('checkbox').id, 'id-jupiter');
        });

        it('should render multiple nodes', () => {
            render(
                <CheckboxTree
                    id="id"
                    nodes={[
                        { value: 'jupiter', label: 'Jupiter' },
                        { value: 'saturn', label: 'Saturn' },
                    ]}
                />,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-jupiter');
            assert.equal(screen.getByLabelText('Saturn').id, 'id-saturn');
        });

        it('should render child nodes', () => {
            render(
                <CheckboxTree
                    expanded={['jupiter']}
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
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Io'));
            assert.isNotNull(screen.queryByLabelText('Europa'));
        });

        it('should render a node with no `children` array as a leaf', () => {
            const { container } = render(
                <CheckboxTree
                    nodes={[
                        { value: 'jupiter', label: 'Jupiter' },
                    ]}
                />,
            );

            const { classList } = container.querySelector('.rct-node');

            assert.isFalse(classList.contains('rct-node-parent'));
            assert.isTrue(classList.contains('rct-node-leaf'));
        });

        it('should render a node with an empty `children` array as a parent', () => {
            const { container } = render(
                <CheckboxTree
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                            children: [],
                        },
                    ]}
                />,
            );

            const { classList } = container.querySelector('.rct-node');

            assert.isTrue(classList.contains('rct-node-parent'));
            assert.isFalse(classList.contains('rct-node-leaf'));
        });

        // https://github.com/jakezatecky/react-checkbox-tree/issues/258
        it('should render a node with an empty `children` array as unchecked by default', () => {
            render(
                <CheckboxTree
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                            children: [],
                        },
                    ]}
                />,
            );

            assert.isFalse(screen.getByRole('checkbox').checked);
        });

        it('should throw an error when duplicate values are used', async () => {
            // Suppress caught errors from React
            console.error = () => {};

            let errorMessage = '';

            try {
                render(
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
                    />,
                );
            } catch (e) {
                if (e instanceof CheckboxTreeError) {
                    errorMessage = e.message;
                } else {
                    throw e;
                }
            }

            assert.equal(errorMessage, "Duplicate value 'jupiter' detected. All node values must be unique.");
        });
    });

    describe('noCascade', () => {
        it('should not toggle the check state of children when set to true', async () => {
            let actual = null;

            render(
                <CheckboxTree
                    noCascade
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
                    onCheck={(checked) => {
                        actual = checked;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actual, ['jupiter']);
        });

        it('should toggle the check state of children when set to false', async () => {
            let actual = null;

            render(
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
                    onCheck={(checked) => {
                        actual = checked;
                    }}
                />,
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
                    />,
                );

                assert.isTrue(screen.getByLabelText('Jupiter').disabled);
            });

            it('should disable the child nodes when `noCascade` is false', () => {
                render(
                    <CheckboxTree
                        expanded={['jupiter']}
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
                    />,
                );

                assert.isTrue(screen.getByLabelText('Europa').disabled);
            });

            it('should NOT disable the child nodes when `noCascade` is true', () => {
                render(
                    <CheckboxTree
                        expanded={['jupiter']}
                        noCascade
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
                    />,
                );

                assert.isFalse(screen.getByLabelText('Europa').disabled);
            });

            // https://github.com/jakezatecky/react-checkbox-tree/issues/119
            it('should be able to change disabled state after the initial render', () => {
                const nodes = [
                    {
                        value: 'jupiter',
                        label: 'Jupiter',
                        children: [
                            { value: 'europa', label: 'Europa' },
                        ],
                    },
                ];
                const { rerender } = render(
                    <CheckboxTree
                        disabled
                        expanded={['jupiter']}
                        nodes={nodes}
                    />,
                );

                rerender(
                    <CheckboxTree
                        expanded={['jupiter']}
                        nodes={nodes}
                    />,
                );

                assert.isFalse(screen.getByLabelText('Europa').disabled);
            });
        });
    });

    describe('onlyLeafCheckboxes', () => {
        it('should only render checkboxes for leaf nodes', () => {
            render(
                <CheckboxTree
                    expanded={['jupiter']}
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
                    onlyLeafCheckboxes
                />,
            );

            assert.isNull(screen.queryByLabelText('Jupiter'));
            assert.isNotNull(screen.queryByLabelText('Io'));
            assert.isNotNull(screen.queryByLabelText('Europa'));
        });
    });

    describe('showExpandAll', () => {
        it('should render the expand all/collapse all buttons', () => {
            render(
                <CheckboxTree
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    showExpandAll
                />,
            );

            assert.isNotNull(screen.queryByLabelText('Expand all'));
            assert.isNotNull(screen.queryByLabelText('Collapse all'));
        });

        describe('expandAll', () => {
            it('should add all parent nodes to the `expanded` array', async () => {
                let actualExpanded = null;

                render(
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
                        onExpand={(expanded) => {
                            actualExpanded = expanded;
                        }}
                    />,
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
                        onExpand={(expanded) => {
                            actualExpanded = expanded;
                        }}
                    />,
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
                <CheckboxTree
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                        },
                    ]}
                    showNodeTitle
                />,
            );

            assert.equal(container.querySelector('label').title, 'Jupiter');
        });

        it('should prioritize the node `title` over the `label', () => {
            const { container } = render(
                <CheckboxTree
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                            title: 'That Big Failed Star',
                        },
                    ]}
                    showNodeTitle
                />,
            );

            assert.equal(container.querySelector('label').title, 'That Big Failed Star');
        });
    });

    describe('onCheck', () => {
        it('should add all children of the checked parent to the checked array', async () => {
            let actualChecked = null;

            render(
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
                    onCheck={(checked) => {
                        actualChecked = checked;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actualChecked, ['io', 'europa']);
        });

        // https://github.com/jakezatecky/react-checkbox-tree/issues/258
        it('should toggle a node with an empty `children` array', async () => {
            let actualChecked = {};
            const makeEmptyParentNode = (checked) => (
                <CheckboxTree
                    checked={checked}
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                            children: [],
                        },
                    ]}
                    onCheck={(node) => {
                        actualChecked = node;
                    }}
                />
            );

            const user = userEvent.setup();

            // Unchecked to checked
            const { rerender } = render(makeEmptyParentNode([]));
            await user.click(screen.getByRole('checkbox'));
            assert.deepEqual(actualChecked, ['jupiter']);

            // Checked to unchecked
            rerender(makeEmptyParentNode(['jupiter']));
            await user.click(screen.getByRole('checkbox'));
            assert.deepEqual(actualChecked, []);
        });

        it('should not add disabled children to the checked array', async () => {
            let actualChecked = null;

            render(
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
                    onCheck={(checked) => {
                        actualChecked = checked;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.deepEqual(actualChecked, ['europa']);
        });

        it('should pass the node toggled as the second parameter', async () => {
            let actualNode = null;

            render(
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
                    onCheck={(checked, node) => {
                        actualNode = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Jupiter'));

            assert.equal(actualNode.value, 'jupiter');
        });
    });

    describe('onClick', () => {
        it('should pass the node clicked as the first parameter', async () => {
            let actualNode = null;

            render(
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
                    onClick={(node) => {
                        actualNode = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByText('Jupiter'));

            assert.equal(actualNode.value, 'jupiter');
        });
    });

    describe('onExpand', () => {
        it('should toggle the expansion state of the target node', async () => {
            let actualExpanded = null;

            render(
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
                    onExpand={(expanded) => {
                        actualExpanded = expanded;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Expand node'));

            assert.deepEqual(actualExpanded, ['jupiter']);
        });

        it('should pass the node toggled as the second parameter', async () => {
            let actualNode = null;

            render(
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
                    onExpand={(expanded, node) => {
                        actualNode = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Expand node'));

            assert.equal(actualNode.value, 'jupiter');
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
                    isLeaf,
                    isParent,
                    treeDepth,
                    index,
                    parent: { value: parentValue },
                } = node;

                return {
                    value,
                    label,
                    isLeaf,
                    isParent,
                    treeDepth,
                    index,
                    parentValue,
                };
            };
            render(
                <CheckboxTree
                    expanded={['jupiter']}
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                            children: [
                                { value: 'io', label: 'Io', title: 'Io' },
                                { value: 'europa', label: 'Europa' },
                            ],
                        },
                    ]}
                    onCheck={(checked, node) => {
                        checkNode = node;
                    }}
                    onClick={(node) => {
                        clickNode = node;
                    }}
                    onExpand={(expanded, node) => {
                        expandNode = node;
                    }}
                />,
            );
            const expectedLeafMetadata = {
                value: 'io',
                label: 'Io',
                isLeaf: true,
                isParent: false,
                treeDepth: 1,
                index: 0,
                parentValue: 'jupiter',
            };
            const expectedParentMetadata = {
                value: 'jupiter',
                label: 'Jupiter',
                isLeaf: false,
                isParent: true,
                treeDepth: 0,
                index: 0,
                parentValue: undefined,
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
