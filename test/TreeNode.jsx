import React from 'react';
import { assert } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseTreeNode from '../src/js/components/TreeNode';
import { IconContext, LanguageContext } from '../src/js/contexts';
import lang from '../src/js/lang/default';
import NodeModel from '../src/js/models/NodeModel';
import TreeModel from '../src/js/models/TreeModel';

const icons = {
    check: <span className="rct-icon rct-icon-check" />,
    uncheck: <span className="rct-icon rct-icon-uncheck" />,
    halfCheck: <span className="rct-icon rct-icon-half-check" />,
    expandClose: <span className="rct-icon rct-icon-expand-close" />,
    expandOpen: <span className="rct-icon rct-icon-expand-open" />,
    parentClose: <span className="rct-icon rct-icon-parent-close" />,
    parentOpen: <span className="rct-icon rct-icon-parent-open" />,
    leaf: <span className="rct-icon rct-icon-leaf" />,
};

const testTree = new TreeModel([
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
]);

const baseProps = {
    checkKeys: [' ', 'Enter'],
    disabled: false,
    expandDisabled: false,
    expanded: false,
    isLeaf: true,
    isParent: false,
    noCascade: false,
    node: testTree.getNode('jupiter'),
    optimisticToggle: true,
    showNodeIcon: true,
    treeId: 'id',
    onCheck: () => {},
    onExpand: () => {},
};

function TreeNode(props) {
    return (
        <LanguageContext.Provider value={lang}>
            <IconContext.Provider value={icons}>
                <BaseTreeNode {...props} />
            </IconContext.Provider>
        </LanguageContext.Provider>
    );
}

describe('<TreeNode />', () => {
    describe('component', () => {
        it('should render the rct-node container', () => {
            const { container } = render(
                <TreeNode {...baseProps} />,
            );

            assert.isNotNull(container.querySelector('.rct-node'));
        });

        it('should render a label associated with a checkbox', () => {
            render(
                <TreeNode {...baseProps} />,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-jupiter');
            assert.equal(screen.getByRole('checkbox').id, 'id-jupiter');
        });

        it('should render an id based on an integer value', () => {
            render(
                <TreeNode
                    {...baseProps}
                    node={new NodeModel(
                        { label: 'Jupiter', value: 0 },
                        {},
                        1,
                        0,
                    )}
                />,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-0');
        });

        it('should render an id based on a float value', () => {
            render(
                <TreeNode
                    {...baseProps}
                    node={new NodeModel(
                        { label: 'Jupiter', value: 0.25 },
                        {},
                        1,
                        0,
                    )}
                />,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-0.25');
        });
    });

    describe('disabled', () => {
        it('should disable the hidden <input> element', () => {
            render(
                <TreeNode {...baseProps} disabled />,
            );

            assert.isTrue(screen.getByRole('checkbox').disabled);
        });
    });

    describe('expandDisabled', () => {
        it('should disable the expand <button>', () => {
            render(
                <TreeNode {...baseProps} expandDisabled isLeaf={false} />,
            );

            assert.isTrue(screen.getByLabelText('Expand node').disabled);
        });
    });

    describe('node', () => {
        describe('checkState', () => {
            it('should render icons associated with each check state', () => {
                const iconMap = {
                    0: 'rct-icon-uncheck',
                    1: 'rct-icon-check',
                    2: 'rct-icon-half-check',
                };

                Object.keys(iconMap).forEach((state) => {
                    const node = new NodeModel(
                        {
                            label: 'Jupiter',
                            value: 'jupiter',
                            checked: parseInt(state, 10),
                        },
                        {},
                        1,
                        0,
                    );
                    node.checkState = parseInt(state, 10);

                    const { container } = render(
                        <TreeNode
                            {...baseProps}
                            node={node}
                        />,
                    );

                    assert.isNotNull(container.querySelector(`.${iconMap[state]}`));
                });
            });

            it('should render an unchecked input element when not set to 1', () => {
                const node = new NodeModel(
                    {
                        label: 'Jupiter',
                        value: 'jupiter',
                    },
                    {},
                    1,
                    0,
                );

                node.checkState = 0;
                const { rerender } = render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isFalse(screen.getByRole('checkbox').checked);

                node.checkState = 2;
                rerender(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isFalse(screen.getByRole('checkbox').checked);
            });

            it('should render a checked input element when set to 1', () => {
                const node = new NodeModel(
                    {
                        label: 'Jupiter',
                        value: 'jupiter',
                    },
                    {},
                    1,
                    0,
                );

                node.checkState = 1;
                render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isTrue(screen.getByRole('checkbox').checked);
            });
        });

        describe('className', () => {
            it('should append the supplied className to <li> of the node', () => {
                const node = new NodeModel(
                    {
                        label: 'Jupiter',
                        value: 'jupiter',
                        className: 'my-test-class',
                    },
                    {},
                    1,
                    0,
                );
                const { container } = render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isNotNull(container.querySelector('.my-test-class'));
            });
        });

        describe('expanded', () => {
            it('should render children when set to true', async () => {
                const node = testTree.getNode('jupiter').clone();
                node.expanded = true;
                render(
                    <TreeNode {...baseProps} expanded node={node}>
                        <ol>
                            <TreeNode {...baseProps} node={testTree.getNode('io')} />
                        </ol>
                    </TreeNode>,
                );

                assert.isNotNull(await screen.queryByLabelText('Io'));
            });

            it('should not render children when set to false', async () => {
                const node = testTree.getNode('jupiter').clone();
                node.expanded = false;
                render(
                    <TreeNode {...baseProps} node={node}>
                        <ol>
                            <TreeNode {...baseProps} node={testTree.getNode('io')} />
                            <TreeNode {...baseProps} node={testTree.getNode('europa')} />
                        </ol>
                    </TreeNode>,
                );

                assert.isNull(await screen.queryByLabelText('Io'));
            });

            it('should render expanded icons when set to true', () => {
                const node = testTree.getNode('jupiter').clone();
                node.expanded = true;
                const { container } = render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isNotNull(container.querySelector('.rct-icon-expand-open'));
                assert.isNotNull(container.querySelector('.rct-icon-parent-open'));
            });

            it('should render collapsed icons when set to false', () => {
                const node = testTree.getNode('jupiter').clone();
                node.expanded = false;
                const { container } = render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isNotNull(container.querySelector('.rct-icon-expand-close'));
                assert.isNotNull(container.querySelector('.rct-icon-parent-close'));
            });

            it('should append the `rct-node-expanded` class to the node when set to true', () => {
                const node = testTree.getNode('jupiter').clone();
                node.expanded = true;
                render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isTrue(screen.getByRole('listitem').classList.contains('rct-node-expanded'));
            });

            it('should append the `rct-node-collapsed` class to the node when set to false', () => {
                const node = testTree.getNode('jupiter').clone();
                node.expanded = false;
                render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isTrue(screen.getByRole('listitem').classList.contains('rct-node-collapsed'));
            });

            it('should not append any expanded/collapsed classes to the node when a leaf', () => {
                render(
                    <TreeNode {...baseProps} node={testTree.getNode('io')} />,
                );

                const { classList } = screen.getByRole('listitem');

                assert.isFalse(classList.contains('rct-node-expanded'));
                assert.isFalse(classList.contains('rct-node-collapsed'));
            });
        });

        describe('icon', () => {
            it('should replace the node\'s icons with the supplied value', () => {
                const node = testTree.getNode('jupiter').clone();
                node.icon = (<span className="fa fa-plus" />);
                const { container } = render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.isNotNull(container.querySelector('.rct-node-icon > .fa.fa-plus'));
            });
        });

        describe('label', () => {
            it('should render the node\'s label', async () => {
                render(
                    <TreeNode {...baseProps} node={testTree.getNode('europa')} />,
                );

                assert.isNotNull(screen.queryByLabelText('Europa'));
            });
        });

        describe('title', () => {
            it('should add the `title` property to the label when set', () => {
                const node = testTree.getNode('jupiter').clone();
                node.title = 'Some extra text';

                const { container } = render(
                    <TreeNode {...baseProps} node={node} />,
                );

                assert.equal(container.querySelector('label').title, 'Some extra text');
            });

            it('should add the `title` property to the bare label when set on a checkbox-less node', () => {
                const node = testTree.getNode('jupiter').clone();
                node.title = 'Some extra text';

                const { container } = render(
                    <TreeNode {...baseProps} node={node} showCheckbox={false} />,
                );

                assert.equal(container.querySelector('.rct-bare-label').title, 'Some extra text');
            });
        });
    });

    describe('showCheckbox', () => {
        it('should render a checkbox for the node when true', () => {
            const { container } = render(
                <TreeNode {...baseProps} />,
            );

            assert.isNotNull(container.querySelector('.rct-checkbox > .rct-icon-half-check'));
        });

        it('should not render a checkbox or label for the node when false', async () => {
            const { container } = render(
                <TreeNode {...baseProps} showCheckbox={false} />,
            );

            assert.isNull(await screen.queryByLabelText('Jupiter'));
            assert.isNotNull(container.querySelector('.rct-bare-label'));
        });
    });

    describe('showNodeIcon', () => {
        it('should render the node icon when true', () => {
            const { container } = render(
                <TreeNode
                    {...baseProps}
                    node={testTree.getNode('io')}
                />,
            );

            assert.isNotNull(container.querySelector('.rct-node-icon > .rct-icon-leaf'));
        });

        it('should not render the node icon when false', () => {
            const { container } = render(
                <TreeNode
                    {...baseProps}
                    node={testTree.getNode('io')}
                    showNodeIcon={false}
                />,
            );

            assert.isNull(container.querySelector('.rct-node-icon > .rct-icon-leaf'));
        });
    });

    describe('showNodeTitle', () => {
        it('should add `title` properties to a TreeNode from the `label` property when set', () => {
            const { container } = render(
                <TreeNode
                    {...baseProps}
                    node={testTree.getNode('jupiter')}
                    showNodeTitle
                />,
            );

            assert.equal(container.querySelector('label').title, 'Jupiter');
        });

        it('should prioritize the node `title` over the `label', () => {
            const node = testTree.getNode('jupiter').clone();
            node.title = 'That Big Failed Star';

            const { container } = render(
                <TreeNode
                    {...baseProps}
                    node={node}
                    showNodeTitle
                />,
            );

            assert.equal(container.querySelector('label').title, 'That Big Failed Star');
        });
    });

    describe('treeId', () => {
        it('should add {treeId}-{node.value} as id to input checkbox ', async () => {
            render(
                <TreeNode
                    {...baseProps}
                    node={testTree.getNode('jupiter')}
                    treeId="my-awesome-id"
                />,
            );

            assert.equal(screen.getByRole('checkbox').id, 'my-awesome-id-jupiter');
        });
    });

    describe('onCheck', () => {
        it('should pass the checked node\'s value property', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    node={testTree.getNode('jupiter')}
                    onCheck={(nodeKey) => {
                        actual = nodeKey;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByRole('checkbox'));

            assert.equal(actual, 'jupiter');
        });

        it('should trigger on key press', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    node={testTree.getNode('jupiter')}
                    onCheck={(nodeKey) => {
                        actual = nodeKey;
                    }}
                />,
            );

            await fireEvent.keyUp(screen.getByRole('checkbox'), { key: 'Enter' });

            assert.equal(actual, 'jupiter');
        });
    });

    describe('onExpand', () => {
        it('should pass the current node\'s value', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    node={testTree.getNode('jupiter')}
                    onExpand={(nodeKey) => {
                        actual = nodeKey;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Expand node'));

            assert.equal(actual, 'jupiter');
        });
    });

    describe('onClick', () => {
        it('should render the label inside of the DOM label when null', async () => {
            render(
                <TreeNode
                    {...baseProps}
                    onClick={null}
                />,
            );

            assert.isNotNull(await screen.queryByLabelText('Jupiter'));
        });

        it('should render the label outside of the DOM label when NOT null', async () => {
            render(
                <TreeNode
                    {...baseProps}
                    onClick={() => {}}
                />,
            );

            assert.isNull(await screen.queryByLabelText('Jupiter'));
        });

        it('should pass the clicked node\'s value property', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    node={testTree.getNode('jupiter')}
                    onClick={(nodeKey) => {
                        actual = nodeKey;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByText('Jupiter'));

            assert.equal(actual, 'jupiter');
        });
    });
});
