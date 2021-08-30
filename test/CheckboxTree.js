import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert } from 'chai';

import CheckboxTree from '../src/js/CheckboxTree';
import CheckboxTreeError from '../src/js/CheckboxTreeError';
import TreeNode from '../src/js/TreeNode';

describe('<CheckboxTree />', () => {
    describe('component', () => {
        it('should render the react-checkbox-tree container', () => {
            const wrapper = shallow(
                <CheckboxTree
                    nodes={[]}
                    onCheck={() => {}}
                    onExpand={() => {}}
                />,
            );

            assert.isTrue(wrapper.find('.react-checkbox-tree').exists());
        });
    });

    describe('checkModel', () => {
        describe('all', () => {
            it('should record checked parent and leaf nodes', () => {
                let actual = null;

                const wrapper = mount(
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

                wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
                assert.deepEqual(['jupiter', 'io', 'europa'], actual);
            });

            it('should percolate `checked` to all parents and grandparents if all leaves are checked', () => {
                let actual = null;

                const wrapper = mount(
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

                wrapper.find('TreeNode[value="europa"] input[type="checkbox"]').simulate('click');
                assert.deepEqual(['sol', 'mercury', 'jupiter', 'io', 'europa'], actual);
            });

            it('should NOT percolate `checked` to the parent if not all leaves are checked', () => {
                let actual = null;

                const wrapper = mount(
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

                wrapper.find('TreeNode[value="europa"] input[type="checkbox"]').simulate('click');
                assert.deepEqual(['europa'], actual);
            });
        });

        describe('leaf', () => {
            it('should only record leaf nodes in the checked array', () => {
                let actual = null;

                const wrapper = mount(
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

                wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
                assert.deepEqual(['io', 'europa'], actual);
            });
        });
    });

    describe('checked', () => {
        it('should not throw an exception if it contains values that are not in the `nodes` property', () => {
            const wrapper = shallow(
                <CheckboxTree
                    checked={['neptune']}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isTrue(wrapper.find('.react-checkbox-tree').exists());
        });
    });

    describe('direction', () => {
        it('should add the class rct-direction-rtl to the root when set to `rtl`', () => {
            const wrapper = shallow(
                <CheckboxTree direction="rtl" nodes={[]} />,
            );

            assert.isTrue(wrapper.find('.react-checkbox-tree.rct-direction-rtl').exists());
        });
    });

    describe('disabled', () => {
        it('should add the class rct-disabled to the root', () => {
            const wrapper = shallow(
                <CheckboxTree disabled nodes={[]} />,
            );

            assert.isTrue(wrapper.find('.react-checkbox-tree.rct-disabled').exists());
        });
    });

    describe('expanded', () => {
        it('should not throw an exception if it contains values that are not in the `nodes` property', () => {
            const wrapper = shallow(
                <CheckboxTree
                    expanded={['mars']}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isTrue(wrapper.find('.react-checkbox-tree').exists());
        });
    });

    describe('icons', () => {
        it('should pass the property directly to tree nodes', () => {
            const wrapper = shallow(
                <CheckboxTree
                    icons={{ check: <span className="other-check" /> }}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal('other-check', shallow(
                wrapper.find(TreeNode).prop('icons').check,
            ).prop('className'));
        });

        it('should be merged in with the defaults when keys are missing', () => {
            const wrapper = shallow(
                <CheckboxTree
                    icons={{ check: <span className="other-check" /> }}
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal('rct-icon rct-icon-uncheck', shallow(
                wrapper.find(TreeNode).prop('icons').uncheck,
            ).prop('className'));
        });
    });

    describe('iconsClass', () => {
        it('should apply the specified icon style to the tree', () => {
            const wrapper = shallow(
                <CheckboxTree
                    iconsClass="some-class"
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.isTrue(wrapper.hasClass('rct-icons-some-class'));
        });
    });

    describe('id', () => {
        it('should pass the id to the top-level DOM node', () => {
            const wrapper = shallow(
                <CheckboxTree
                    id="my-awesome-id"
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal('my-awesome-id', wrapper.prop('id'));
        });

        it('should pass the id as a property directly to tree nodes', () => {
            const wrapper = shallow(
                <CheckboxTree
                    id="my-awesome-id"
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal('my-awesome-id', wrapper.find(TreeNode).prop('treeId'));
        });
    });

    describe('lang', () => {
        it('should override default language values', () => {
            const wrapper = shallow(
                <CheckboxTree
                    lang={{
                        expandAll: 'Expand it',
                        collapseAll: 'Collapse it',
                        toggle: 'Toggle it',
                    }}
                    nodes={[]}
                    showExpandAll
                />,
            );

            assert.equal('Expand it', wrapper.find('.rct-option-expand-all').prop('title'));
        });
    });

    describe('nativeCheckboxes', () => {
        it('should add the class rct-native-display to the root', () => {
            const wrapper = shallow(
                <CheckboxTree nativeCheckboxes nodes={[]} />,
            );

            assert.isTrue(wrapper.find('.react-checkbox-tree.rct-native-display').exists());
        });
    });

    describe('nodes', () => {
        it('should render the node\'s label', () => {
            const wrapper = shallow(
                <CheckboxTree
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal('Jupiter', wrapper.find(TreeNode).prop('label'));
        });

        it('should render the node\'s value', () => {
            const wrapper = shallow(
                <CheckboxTree
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                />,
            );

            assert.equal('jupiter', wrapper.find(TreeNode).prop('value'));
        });

        it('should render multiple nodes', () => {
            const wrapper = shallow(
                <CheckboxTree
                    nodes={[
                        { value: 'jupiter', label: 'Jupiter' },
                        { value: 'saturn', label: 'Saturn' },
                    ]}
                />,
            );

            assert.equal('jupiter', wrapper.find(TreeNode).at(0).prop('value'));
            assert.equal('saturn', wrapper.find(TreeNode).at(1).prop('value'));
        });

        it('should render node children', () => {
            const wrapper = shallow(
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
                />,
            );

            assert.deepEqual(
                wrapper.find(TreeNode).prop('children').props,
                { children: [null, null] },
            );
        });

        it('should render a node with no `children` array as a leaf', () => {
            const wrapper = shallow(
                <CheckboxTree
                    nodes={[
                        { value: 'jupiter', label: 'Jupiter' },
                    ]}
                />,
            );

            assert.equal(false, wrapper.find(TreeNode).prop('isParent'));
            assert.equal(true, wrapper.find(TreeNode).prop('isLeaf'));
        });

        it('should render a node with an empty `children` array as a parent', () => {
            const wrapper = shallow(
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

            assert.equal(true, wrapper.find(TreeNode).prop('isParent'));
            assert.equal(false, wrapper.find(TreeNode).prop('isLeaf'));
        });

        // https://github.com/jakezatecky/react-checkbox-tree/issues/258
        it('should render a node with an empty `children` array as unchecked by default', () => {
            const wrapper = shallow(
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

            assert.equal(false, wrapper.find(TreeNode).prop('checked'));
        });

        it('should render a node with a non-empty `children` array as a parent', () => {
            const wrapper = shallow(
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
                />,
            );

            assert.equal(true, wrapper.find(TreeNode).prop('isParent'));
            assert.equal(false, wrapper.find(TreeNode).prop('isLeaf'));
        });

        it('should throw an error when duplicate values are used', () => {
            let errorMessage = null;

            try {
                shallow(
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

            assert.equal("Duplicate value 'jupiter' detected. All node values must be unique.", errorMessage);
        });
    });

    describe('noCascade', () => {
        it('should not toggle the check state of children when set to true', () => {
            let actual = null;

            const wrapper = mount(
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
            assert.deepEqual(['jupiter'], actual);
        });

        it('should toggle the check state of children when set to false', () => {
            let actual = null;

            const wrapper = mount(
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
            assert.deepEqual(['io', 'europa'], actual);
        });
    });

    describe('nodeProps', () => {
        describe('disabled', () => {
            it('should disable the target node when set to true', () => {
                const wrapper = shallow(
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

                assert.isTrue(wrapper.find(TreeNode).prop('disabled'));
            });

            it('should disable the child nodes when `noCascade` is false', () => {
                const wrapper = shallow(
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

                assert.isTrue(wrapper.find('TreeNode[value="europa"]').prop('disabled'));
            });

            it('should NOT disable the child nodes when `noCascade` is true', () => {
                const wrapper = shallow(
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

                assert.isFalse(wrapper.find('TreeNode[value="europa"]').prop('disabled'));
            });

            // https://github.com/jakezatecky/react-checkbox-tree/issues/119
            it('should be able to change disabled state after the initial render', () => {
                const wrapper = shallow(
                    <CheckboxTree
                        disabled
                        expanded={['jupiter']}
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [
                                    { value: 'europa', label: 'Europa' },
                                ],
                            },
                        ]}
                    />,
                );

                wrapper.setProps({ disabled: false });

                assert.isFalse(wrapper.find('TreeNode[value="europa"]').prop('disabled'));
            });
        });
    });

    describe('onlyLeafCheckboxes', () => {
        it('should only render checkboxes for leaf nodes', () => {
            const wrapper = mount(
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

            assert.isFalse(wrapper.find('TreeNode[value="jupiter"]').prop('showCheckbox'));
            assert.isTrue(wrapper.find('TreeNode[value="io"]').prop('showCheckbox'));
            assert.isTrue(wrapper.find('TreeNode[value="europa"]').prop('showCheckbox'));
        });
    });

    describe('showExpandAll', () => {
        it('should render the expand all/collapse all buttons', () => {
            const wrapper = shallow(
                <CheckboxTree
                    nodes={[{ value: 'jupiter', label: 'Jupiter' }]}
                    showExpandAll
                />,
            );

            assert.isTrue(wrapper.find('.rct-options .rct-option-expand-all').exists());
            assert.isTrue(wrapper.find('.rct-options .rct-option-collapse-all').exists());
        });

        describe('expandAll', () => {
            it('should add all parent nodes to the `expanded` array', () => {
                let actualExpanded = null;
                const wrapper = shallow(
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

                wrapper.find('.rct-option-expand-all').simulate('click');
                assert.deepEqual(['mars', 'jupiter'], actualExpanded);
            });
        });

        describe('collapseAll', () => {
            it('should remove all nodes from the `expanded` array', () => {
                let actualExpanded = null;
                const wrapper = shallow(
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

                wrapper.find('.rct-option-collapse-all').simulate('click');
                assert.deepEqual([], actualExpanded);
            });
        });
    });

    describe('showNodeTitle', () => {
        it('should add `title` properties to a TreeNode from the `label` property when set', () => {
            const wrapper = shallow(
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

            assert.equal('Jupiter', wrapper.find('TreeNode').prop('title'));
        });

        it('should prioritize the node `title` over the `label', () => {
            const wrapper = shallow(
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

            assert.equal('That Big Failed Star', wrapper.find('TreeNode').prop('title'));
        });
    });

    describe('onCheck', () => {
        it('should add all children of the checked parent to the checked array', () => {
            let actualChecked = null;

            const wrapper = mount(
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
            assert.deepEqual(['io', 'europa'], actualChecked);
        });

        // https://github.com/jakezatecky/react-checkbox-tree/issues/258
        it('should toggle a node with an empty `children` array', () => {
            let actualChecked = {};
            const makeEmptyParentNode = (checked) => (
                mount(
                    <CheckboxTree
                        nodes={[
                            {
                                value: 'jupiter',
                                label: 'Jupiter',
                                children: [],
                            },
                        ]}
                        checked={checked}
                        onCheck={(node) => {
                            actualChecked = node;
                        }}
                    />,
                )
            );

            // Unchecked to checked
            let wrapper = makeEmptyParentNode([]);
            wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
            assert.deepEqual(['jupiter'], actualChecked);

            // Checked to unchecked
            wrapper = makeEmptyParentNode(['jupiter']);
            wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
            assert.deepEqual([], actualChecked);
        });

        it('should not add disabled children to the checked array', () => {
            let actualChecked = null;

            const wrapper = mount(
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
            assert.deepEqual(['europa'], actualChecked);
        });

        it('should pass the node toggled as the second parameter', () => {
            let actualNode = null;

            const wrapper = mount(
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('click');
            assert.equal('jupiter', actualNode.value);
        });
    });

    describe('onClick', () => {
        it('should pass the node clicked as the first parameter', () => {
            let actualNode = null;

            const wrapper = mount(
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

            wrapper.find('.rct-node-clickable').simulate('click');
            assert.equal('jupiter', actualNode.value);
        });
    });

    describe('onExpand', () => {
        it('should toggle the expansion state of the target node', () => {
            let actualExpanded = null;

            const wrapper = mount(
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

            wrapper.find('TreeNode Button.rct-collapse-btn').simulate('click');
            assert.deepEqual(['jupiter'], actualExpanded);
        });

        it('should pass the node toggled as the second parameter', () => {
            let actualNode = null;

            const wrapper = mount(
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

            wrapper.find('TreeNode Button.rct-collapse-btn').simulate('click');
            assert.equal('jupiter', actualNode.value);
        });
    });

    describe('handler.targetNode', () => {
        it('should supply a variety of metadata relating to the target node', () => {
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
            const wrapper = mount(
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

            // onCheck
            wrapper.find('TreeNode').at(1).find('input[type="checkbox"]').simulate('click');
            assert.deepEqual(expectedLeafMetadata, getNodeMetadata(checkNode));

            // onClick
            wrapper.find('TreeNode').at(1).find('.rct-node-clickable').simulate('click');
            assert.deepEqual(expectedLeafMetadata, getNodeMetadata(clickNode));

            // onExpand
            wrapper.find('TreeNode').at(0).find('Button.rct-collapse-btn').simulate('click');
            assert.deepEqual(expectedParentMetadata, getNodeMetadata(expandNode));
        });
    });
});
