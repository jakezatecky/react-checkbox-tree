import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';
import nanoid from 'nanoid';

import TreeNode from './TreeNode';
import nodeShape from './nodeShape';

class CheckboxTree extends React.Component {
    static propTypes = {
        nodes: PropTypes.arrayOf(nodeShape).isRequired,
        checked: PropTypes.arrayOf(PropTypes.string),
        disabled: PropTypes.bool,
        expandDisabled: PropTypes.bool,
        expandOnClick: PropTypes.bool,
        expanded: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string,
        nameAsArray: PropTypes.bool,
        nativeCheckboxes: PropTypes.bool,
        noCascade: PropTypes.bool,
        onlyLeafCheckboxes: PropTypes.bool,
        optimisticToggle: PropTypes.bool,
        showNodeIcon: PropTypes.bool,
        onCheck: PropTypes.func,
        onClick: PropTypes.func,
        onExpand: PropTypes.func,
    };

    static defaultProps = {
        checked: [],
        disabled: false,
        expandDisabled: false,
        expandOnClick: false,
        expanded: [],
        name: undefined,
        nameAsArray: false,
        nativeCheckboxes: false,
        noCascade: false,
        onlyLeafCheckboxes: false,
        optimisticToggle: true,
        showNodeIcon: true,
        onCheck: () => {},
        onClick: () => {},
        onExpand: () => {},
    };

    constructor(props) {
        super(props);

        this.id = `rct-${nanoid(7)}`;
        this.flatNodes = {};
        this.hasRadioGroups = false;

        this.flattenNodes(props.nodes);
        this.unserializeLists({
            checked: props.checked,
            expanded: props.expanded,
        });

        if (this.hasRadioGroups) {
            this.checkRadioGroups(true);
        }

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    componentWillReceiveProps({ nodes, checked, expanded }) {
        if (!isEqual(this.props.nodes, nodes)) {
            this.flattenNodes(nodes);
        }

        this.unserializeLists({ checked, expanded });

        if (this.hasRadioGroups) {
            this.checkRadioGroups(true);
        }
    }

    onCheck(nodeInfo) {
        // nodeInfo is object from TreeNode
        const { value, checked } = nodeInfo;

        const flatNode = this.flatNodes[value];
        const { parent, self } = flatNode;

        let { noCascade } = this.props;
        if (flatNode.isRadio) {
            noCascade = true;
            this.turnSiblingsOff(parent, self);
        }

        this.toggleChecked(self, checked, noCascade);
        this.props.onCheck(this.serializeList('checked'), self);
    }

    onExpand(node) {
        // node is object from TreeNode
        const { onExpand } = this.props;

        this.toggleNode('expanded', node, node.expanded);
        onExpand(this.serializeList('expanded'), node);
    }

    getSiblingList(parent, node) {
        if (parent.children) {
            return parent.children.filter(child => child.value !== node.value);
        }
        return [];
    }

    getShallowCheckState(node, noCascade) {
        // node is from props.nodes
        const flatNode = this.flatNodes[node.value];

        if (flatNode.isLeaf || noCascade || flatNode.isRadioGroup || flatNode.isRadio) {
            return flatNode.checked ? 1 : 0;
        }

        if (node.children.every(child => (this.flatNodes[child.value].checkState === 1))) {
            return 1;
        }

        if (node.children.some(child => (this.flatNodes[child.value].checkState > 0))) {
            return 2;
        }

        return 0;
    }

    getDisabledState(node, parent, disabledProp, noCascade) {
        // node is from props.nodes
        if (disabledProp) {
            return true;
        }

        if (!noCascade && parent.disabled) {
            return true;
        }

        return Boolean(node.disabled);
    }

    checkRadioGroups(useFirst) {
        // check radio groups for multiple checked children
        Object.keys(this.flatNodes)
            .filter(key => this.flatNodes[key].isRadioGroup && !this.flatNodes[key].isLeaf)
            .forEach((key) => {
                const flatNode = this.flatNodes[key];
                const { children } = flatNode.self;

                // check for multiple children
                const checkedNodes = children.filter(node => this.flatNodes[node.value].checked);
                if (checkedNodes.length === 0) {
                    const childKey = useFirst ? 0 : children.length - 1;
                    const checkedChild = children[childKey];
                    this.flatNodes[checkedChild.value].checked = true;
                } else if (checkedNodes.length > 1) {
                    // useFirst ? checkedNodes.shift() : checkedNodes.pop();
                    if (useFirst) {
                        checkedNodes.shift();
                    } else {
                        checkedNodes.pop();
                    }
                    checkedNodes.forEach((node) => {
                        this.flatNodes[node.value].checked = false;
                    });
                }
            });
    }

    toggleChecked(node, isChecked, noCascade) {
        // node is from props.nodes
        const flatNode = this.flatNodes[node.value];

        if (flatNode.isLeaf || noCascade || flatNode.isRadioGroup || flatNode.isRadio) {
            // Set the check status of a leaf node or an uncoupled parent
            this.toggleNode('checked', node, isChecked);
        } else {
            const { children } = flatNode.self;
            // Percolate check status down to all children
            children.forEach((child) => {
                this.toggleChecked(child, isChecked, noCascade);
            });
        }
    }

    toggleNode(key, node, toggleValue) {
        this.flatNodes[node.value][key] = toggleValue;
    }

    turnSiblingsOff(parent, self) {
        this.getSiblingList(parent, self).forEach((sibling) => {
            this.toggleChecked(sibling, false, true);
        });
    }

    flattenNodes(nodes, parentNode = {}) {
        // nodes are from props.nodes
        if (!Array.isArray(nodes) || nodes.length === 0) {
            return;
        }

        nodes.forEach((node) => {
            // set defaults, calculated values and tree references
            if (node.isRadioGroup) {
                this.hasRadioGroups = true;
            }

            this.flatNodes[node.value] = {
                parent: parentNode,
                self: node,
                isLeaf: !Array.isArray(node.children) || node.children.length === 0,
                isRadio: Boolean(parentNode.isRadioGroup),
                isRadioGroup: Boolean(node.isRadioGroup),
                showCheckbox: node.showCheckbox !== undefined ? node.showCheckbox : true,
            };
            this.flattenNodes(node.children, node);
        });
    }

    unserializeLists(lists) {
        // Reset values to false
        Object.keys(this.flatNodes).forEach((value) => {
            Object.keys(lists).forEach((listKey) => {
                this.flatNodes[value][listKey] = false;
            });
        });

        // Unserialize values and set their nodes to true
        Object.keys(lists).forEach((listKey) => {
            lists[listKey].forEach((value) => {
                if (this.flatNodes[value] !== undefined) {
                    const flatNode = this.flatNodes[value];
                    flatNode[listKey] = true;
                }
            });
        });
    }

    serializeList(key) {
        const list = [];

        Object.keys(this.flatNodes).forEach((value) => {
            if (this.flatNodes[value][key]) {
                list.push(value);
            }
        });

        return list;
    }

    renderTreeNodes(nodes, parent = {}) {
        // nodes are props.nodes
        const {
            disabled,
            expandDisabled,
            expandOnClick,
            noCascade,
            onlyLeafCheckboxes,
            optimisticToggle,
            showNodeIcon,
            onClick,
        } = this.props;

        const treeNodes = nodes.map((node) => {
            const key = `${node.value}`;

            const flatNode = this.flatNodes[node.value];

            let children = null;
            if (!flatNode.isLeaf) {
                children = this.renderTreeNodes(node.children, node);
            }

            // set checkState here
            // this can be "shallow" because checkState is updated for all
            // nested children in the recursive call to renderTreeNodes above
            flatNode.checkState = this.getShallowCheckState(node, noCascade);

            const nodeDisabled = this.getDisabledState(node, parent, disabled, noCascade);

            // Show checkbox only if this is a leaf node or showCheckbox is true
            const showCheckbox = onlyLeafCheckboxes ? flatNode.isLeaf : flatNode.showCheckbox;

            // root of tree has no parent value and is expanded by default
            const parentExpanded = parent.value ? this.flatNodes[parent.value].expanded : true;
            if (parentExpanded) {
                return (
                    <TreeNode
                        key={key}
                        checked={flatNode.checkState}
                        className={node.className}
                        disabled={nodeDisabled}
                        expandDisabled={expandDisabled}
                        expandOnClick={expandOnClick}
                        expanded={flatNode.expanded}
                        icon={node.icon}
                        label={node.label}
                        optimisticToggle={optimisticToggle}
                        isLeaf={flatNode.isLeaf}
                        isRadio={flatNode.isRadio}
                        showCheckbox={showCheckbox}
                        showNodeIcon={showNodeIcon}
                        treeId={this.id}
                        value={node.value}
                        onCheck={this.onCheck}
                        onClick={onClick}
                        onExpand={this.onExpand}
                    >
                        {children}
                    </TreeNode>
                );
            }

            return null;
        });

        return (
            <ol>
                {treeNodes}
            </ol>
        );
    }

    renderHiddenInput() {
        if (this.props.name === undefined) {
            return null;
        }

        if (this.props.nameAsArray) {
            return this.renderArrayHiddenInput();
        }

        return this.renderJoinedHiddenInput();
    }

    renderArrayHiddenInput() {
        return this.props.checked.map((value) => {
            const name = `${this.props.name}[]`;

            return <input key={value} name={name} type="hidden" value={value} />;
        });
    }

    renderJoinedHiddenInput() {
        const checked = this.props.checked.join(',');

        return <input name={this.props.name} type="hidden" value={checked} />;
    }

    render() {
        const treeNodes = this.renderTreeNodes(this.props.nodes);

        const className = classNames({
            'react-checkbox-tree': true,
            'rct-disabled': this.props.disabled,
            'rct-native-display': this.props.nativeCheckboxes,
        });

        return (
            <div className={className}>
                {this.renderHiddenInput()}
                {treeNodes}
            </div>
        );
    }
}

export default CheckboxTree;
