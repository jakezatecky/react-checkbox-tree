import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert } from 'chai';

import CheckboxTree from '../src/js/CheckboxTree';
import TreeNode from '../src/js/TreeNode';

describe('<CheckboxTree />', () => {
    describe('component', () => {
        it('should render the react-checkbox-tree container', () => {
            const wrapper = shallow(
                <CheckboxTree
                    checked={[]}
                    expanded={[]}
                    nodes={[]}
                    onCheck={() => {}}
                    onExpand={() => {}}
                />,
            );

            assert.isTrue(wrapper.find('.react-checkbox-tree').exists());
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

    describe('lang', () => {
        it('should override default language values', () => {
            const wrapper = shallow(
                <CheckboxTree
                    lang={{ expandAll: 'Expand it', collapseAll: 'Collapse it' }}
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
    });

    describe('noCascade', () => {
        it('should not toggle the check state of children when set to true', () => {
            let actual = null;

            const wrapper = mount(
                <CheckboxTree
                    checked={[]}
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('change');
            assert.deepEqual(['jupiter'], actual);
        });

        it('should toggle the check state of children when set to false', () => {
            let actual = null;

            const wrapper = mount(
                <CheckboxTree
                    checked={[]}
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('change');
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
        });
    });

    describe('onlyLeafCheckboxes', () => {
        it('should only render show checkboxes for leaf nodes', () => {
            const wrapper = mount(
                <CheckboxTree
                    checked={[]}
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
                    checked={[]}
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('change');
            assert.deepEqual(['io', 'europa'], actualChecked);
        });

        it('should not add disabled children to the checked array', () => {
            let actualChecked = null;

            const wrapper = mount(
                <CheckboxTree
                    checked={[]}
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('change');
            assert.deepEqual(['europa'], actualChecked);
        });

        it('should pass the node toggled as the second parameter', () => {
            let actualNode = null;

            const wrapper = mount(
                <CheckboxTree
                    checked={[]}
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

            wrapper.find('TreeNode input[type="checkbox"]').simulate('change');
            assert.equal('jupiter', actualNode.value);
        });
    });

    describe('onClick', () => {
        it('should pass the node clicked as the first parameter', () => {
            let actualNode = null;

            const wrapper = mount(
                <CheckboxTree
                    checked={[]}
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
        it('should pass the node toggled as the second parameter', () => {
            let actualNode = null;

            const wrapper = mount(
                <CheckboxTree
                    checked={[]}
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
});
