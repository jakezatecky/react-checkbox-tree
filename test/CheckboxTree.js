import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert, expect } from 'chai';

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

    describe('onCheck', () => {
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

            wrapper.find('TreeNode .rct-collapse-btn').simulate('click');
            assert.equal('jupiter', actualNode.value);
        });
    });

    describe('isRadioGroup', () => {
        it('should should render children with radio buttons', () => {
            const wrapper = mount(
                <CheckboxTree
                    checked={[]}
                    expanded={['jupiter']}
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                            isRadioGroup: true,
                            children: [
                                { value: 'io', label: 'Io' },
                                { value: 'europa', label: 'Europa' },
                                { value: 'ganymede', label: 'Ganymede' },
                                { value: 'callisto', label: 'Callisto' },
                            ],
                        },
                    ]}
                />,
            );

            const radioGroupChildren = wrapper.find('TreeNode [value="jupiter"]').children().find(TreeNode);

            const num = radioGroupChildren.length;
            const numOn = wrapper.find('.rct-checkbox .rct-icon-radio-on').length;
            const numOff = wrapper.find('.rct-checkbox .rct-icon-radio-off').length;

            assert.equal(numOn + numOff, num);
            expect(wrapper.find('.rct-icon-radio-on').length).to.equal(1);
            expect(wrapper.find('.rct-icon-radio-off').length).to.equal(3);
        });

        it('should should default check the first item in radio group if none checked', () => {
            const wrapper = mount(
                <CheckboxTree
                    checked={['jupiter']}
                    expanded={['jupiter']}
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                            isRadioGroup: true,
                            children: [
                                { value: 'io', label: 'Io' },
                                { value: 'europa', label: 'Europa' },
                                { value: 'ganymede', label: 'Ganymede' },
                            ],
                        },
                    ]}
                />,
            );

            const radioGroupChildren = wrapper.find('TreeNode [value="jupiter"]').children().find(TreeNode);

            expect(radioGroupChildren.first().props().checked).to.equal(1);
            expect(radioGroupChildren.find('[checked=1]').length).to.equal(1);
            expect(radioGroupChildren.find('[checked=0]').length).to.equal(2);
        });

        it('should should check the first checked child of the radio group if multiple are checked', () => {
            const wrapper = mount(
                <CheckboxTree
                    checked={['jupiter', 'ganymede', 'europa']}
                    expanded={['jupiter']}
                    nodes={[
                        {
                            value: 'jupiter',
                            label: 'Jupiter',
                            isRadioGroup: true,
                            children: [
                                { value: 'io', label: 'Io' },
                                { value: 'europa', label: 'Europa' },
                                { value: 'ganymede', label: 'Ganymede' },
                            ],
                        },
                    ]}
                />,
            );

            const radioGroupChildren = wrapper.find('TreeNode [value="jupiter"]').children().find(TreeNode);

            expect(radioGroupChildren.find('[value="europa"]').props().checked).to.equal(1);
            expect(radioGroupChildren.find('[checked=1]').length).to.equal(1);
            expect(radioGroupChildren.find('[checked=0]').length).to.equal(2);
        });
    });
});
