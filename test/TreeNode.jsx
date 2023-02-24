import React from 'react';
import { assert } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseTreeNode from '../src/js/components/TreeNode';
import { IconContext, LanguageContext } from '../src/js/contexts';
import lang from '../src/js/lang/default';

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

const baseProps = {
    checkKeys: [' ', 'Enter'],
    checked: 0,
    disabled: false,
    expandDisabled: false,
    expanded: false,
    isLeaf: true,
    isParent: false,
    label: 'Jupiter',
    optimisticToggle: true,
    showNodeIcon: true,
    treeId: 'id',
    value: 'jupiter',
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
                <TreeNode {...baseProps} value="jupiter" />,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-jupiter');
            assert.equal(screen.getByRole('checkbox').id, 'id-jupiter');
        });

        it('should render an id based on an integer value', () => {
            render(
                <TreeNode {...baseProps} value={0} />,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-0');
        });

        it('should render an id based on a float value', () => {
            render(
                <TreeNode {...baseProps} value={0.25} />,
            );

            assert.equal(screen.getByLabelText('Jupiter').id, 'id-0.25');
        });
    });

    describe('checked', () => {
        it('should render icons associated with each check state', () => {
            const iconMap = {
                0: 'rct-icon-uncheck',
                1: 'rct-icon-check',
                2: 'rct-icon-half-check',
            };

            Object.keys(iconMap).forEach((state) => {
                const { container } = render(
                    <TreeNode {...baseProps} checked={parseInt(state, 10)} />,
                );

                assert.isNotNull(container.querySelector(`.${iconMap[state]}`));
            });
        });

        it('should render an unchecked input element when not set to 1', () => {
            const { rerender } = render(
                <TreeNode {...baseProps} checked={0} />,
            );

            assert.isFalse(screen.getByRole('checkbox').checked);

            rerender(
                <TreeNode {...baseProps} checked={2} />,
            );

            assert.isFalse(screen.getByRole('checkbox').checked);
        });

        it('should render a checked input element when set to 1', () => {
            render(
                <TreeNode {...baseProps} checked={1} />,
            );

            assert.isTrue(screen.getByRole('checkbox').checked);
        });
    });

    describe('className', () => {
        it('should append the supplied className to <li> of the node', () => {
            const { container } = render(
                <TreeNode {...baseProps} className="my-test-class" />,
            );

            assert.isNotNull(container.querySelector('.my-test-class'));
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

            assert.isTrue(screen.getByLabelText('Expand').disabled);
        });
    });

    describe('expanded', () => {
        it('should render children when set to true', async () => {
            render(
                <TreeNode {...baseProps} expanded isLeaf={false}>
                    <ol>
                        <TreeNode {...baseProps} label="Europa" value="europa" />
                    </ol>
                </TreeNode>,
            );

            assert.isNotNull(await screen.queryByLabelText('Europa'));
        });

        it('should not render children when set to false', async () => {
            render(
                <TreeNode {...baseProps} expanded={false} isLeaf={false}>
                    <TreeNode {...baseProps} label="Europa" value="europa" />
                </TreeNode>,
            );

            assert.isNull(await screen.queryByLabelText('Europa'));
        });

        it('should render expanded icons when set to true', () => {
            const { container } = render(
                <TreeNode {...baseProps} expanded isLeaf={false} />,
            );

            assert.isNotNull(container.querySelector('.rct-icon-expand-open'));
            assert.isNotNull(container.querySelector('.rct-icon-parent-open'));
        });

        it('should render collapsed icons when set to false', () => {
            const { container } = render(
                <TreeNode {...baseProps} expanded={false} isLeaf={false} />,
            );

            assert.isNotNull(container.querySelector('.rct-icon-expand-close'));
            assert.isNotNull(container.querySelector('.rct-icon-parent-close'));
        });

        it('should append the `rct-node-expanded` class to the node when set to true', () => {
            render(
                <TreeNode {...baseProps} expanded isLeaf={false} />,
            );

            assert.isTrue(screen.getByRole('listitem').classList.contains('rct-node-expanded'));
        });

        it('should append the `rct-node-collapsed` class to the node when set to true', () => {
            render(
                <TreeNode {...baseProps} expanded={false} isLeaf={false} />,
            );

            assert.isTrue(screen.getByRole('listitem').classList.contains('rct-node-collapsed'));
        });

        it('should not append any expanded/collapsed classes to the node when a leaf', () => {
            render(
                <TreeNode {...baseProps} expanded isLeaf />,
            );

            const { classList } = screen.getByRole('listitem');

            assert.isFalse(classList.contains('rct-node-expanded'));
            assert.isFalse(classList.contains('rct-node-collapsed'));
        });
    });

    describe('icon', () => {
        it('should replace the node\'s icons with the supplied value', () => {
            const { container } = render(
                <TreeNode {...baseProps} icon={<span className="fa fa-plus" />} />,
            );

            assert.isNotNull(container.querySelector('.rct-node-icon > .fa.fa-plus'));
        });
    });

    describe('label', () => {
        it('should render the node\'s label', async () => {
            render(
                <TreeNode {...baseProps} label="Europa" value="europa" />,
            );

            assert.isNotNull(screen.queryByLabelText('Europa'));
        });
    });

    describe('showCheckbox', () => {
        it('should render a checkbox for the node when true', () => {
            const { container } = render(
                <TreeNode {...baseProps} />,
            );

            assert.isNotNull(container.querySelector('.rct-checkbox .rct-icon-uncheck'));
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
                <TreeNode {...baseProps} />,
            );

            assert.isNotNull(container.querySelector('.rct-node-icon > .rct-icon-leaf'));
        });

        it('should not render the node icon when false', () => {
            const { container } = render(
                <TreeNode {...baseProps} showNodeIcon={false} />,
            );

            assert.isNull(container.querySelector('.rct-node-icon > .rct-icon-leaf'));
        });
    });

    describe('title', () => {
        it('should add the `title` property to the label when set', () => {
            const { container } = render(
                <TreeNode {...baseProps} title="Some extra text" />,
            );

            assert.equal(container.querySelector('label').title, 'Some extra text');
        });

        it('should add the `title` property to the bare label when set on a checkbox-less node', () => {
            const { container } = render(
                <TreeNode {...baseProps} showCheckbox={false} title="Some extra text" />,
            );

            assert.equal(container.querySelector('.rct-bare-label').title, 'Some extra text');
        });
    });

    describe('onCheck', () => {
        it('should pass the current node\'s value', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByRole('checkbox'));

            assert.equal(actual.value, 'jupiter');
        });

        it('should toggle an unchecked node to checked', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    checked={0}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByRole('checkbox'));

            assert.isTrue(actual.checked);
        });

        it('should toggle a checked node to unchecked', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    checked={1}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByRole('checkbox'));

            assert.isFalse(actual.checked);
        });

        it('should toggle a partially-checked node to checked', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    checked={2}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByRole('checkbox'));

            assert.isTrue(actual.checked);
        });

        it('should trigger on key press', async () => {
            let actual = {};

            const { container } = render(
                <TreeNode
                    {...baseProps}
                    checked={2}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            await fireEvent.keyUp(container.querySelector('.rct-checkbox'), { key: 'Enter' });

            assert.isTrue(actual.checked);
        });

        describe('optimisticToggle', () => {
            it('should toggle a partially-checked node to unchecked', async () => {
                let actual = {};

                render(
                    <TreeNode
                        {...baseProps}
                        checked={2}
                        optimisticToggle={false}
                        value="jupiter"
                        onCheck={(node) => {
                            actual = node;
                        }}
                    />,
                );

                const user = userEvent.setup();
                await user.click(screen.getByRole('checkbox'));

                assert.isFalse(actual.checked);
            });
        });
    });

    describe('onExpand', () => {
        it('should toggle the expanded property and pass the current node\'s value', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    expanded
                    isLeaf={false}
                    value="jupiter"
                    onExpand={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByLabelText('Collapse'));

            assert.deepEqual(actual, { value: 'jupiter', expanded: false });
        });
    });

    describe('onClick', () => {
        it('should render the label inside of the DOM label when null', async () => {
            render(
                <TreeNode
                    {...baseProps}
                    value="jupiter"
                    onClick={null}
                />,
            );

            assert.isNotNull(await screen.queryByLabelText('Jupiter'));
        });

        it('should render the label outside of the DOM label when NOT null', async () => {
            render(
                <TreeNode
                    {...baseProps}
                    value="jupiter"
                    onClick={() => {}}
                />,
            );

            assert.isNull(await screen.queryByLabelText('Jupiter'));
        });

        it('should pass the current node\'s value', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    value="jupiter"
                    onClick={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByText('Jupiter'));

            assert.equal(actual.value, 'jupiter');
        });

        it('should return the unchecked node as unchecked', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    checked={0}
                    value="jupiter"
                    onClick={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByText('Jupiter'));

            assert.isFalse(actual.checked);
        });

        it('should return the checked node as checked', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    checked={1}
                    value="jupiter"
                    onClick={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByText('Jupiter'));

            assert.isTrue(actual.checked);
        });

        it('should get the partially-checked node as checked', async () => {
            let actual = {};

            render(
                <TreeNode
                    {...baseProps}
                    checked={2}
                    value="jupiter"
                    onClick={(node) => {
                        actual = node;
                    }}
                />,
            );

            const user = userEvent.setup();
            await user.click(screen.getByText('Jupiter'));

            assert.isTrue(actual.checked);
        });
    });
});
