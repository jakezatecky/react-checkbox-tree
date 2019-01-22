class NodeModel {
    constructor(props, nodes = {}) {
        this.props = props;
        this.flatNodes = nodes;
    }

    clone() {
        const clonedNodes = {};

        // Re-construct nodes one level deep to avoid shallow copy of mutable characteristics
        Object.keys(this.flatNodes).forEach((value) => {
            const node = this.flatNodes[value];
            clonedNodes[value] = { ...node };
        });

        return new NodeModel(this.props, clonedNodes);
    }

    getNode(value) {
        return this.flatNodes[value];
    }

    flattenNodes(nodes, parent = {}) {
        if (!Array.isArray(nodes) || nodes.length === 0) {
            return;
        }

        const { disabled, noCascade } = this.props;

        // Flatten the `node` property for internal lookups
        nodes.forEach((node) => {
            const isParent = this.nodeHasChildren(node);

            this.flatNodes[node.value] = {
                self: node,
                parent,
                isParent,
                isLeaf: !isParent,
                showCheckbox: node.showCheckbox !== undefined ? node.showCheckbox : true,
                disabled: this.getDisabledState(node, parent, disabled, noCascade),
            };
            this.flattenNodes(node.children, node);
        });
    }

    nodeHasChildren(node) {
        return Array.isArray(node.children) && node.children.length > 0;
    }

    getDisabledState(node, parent, disabledProp, noCascade) {
        if (disabledProp) {
            return true;
        }

        if (!noCascade && parent.disabled) {
            return true;
        }

        return Boolean(node.disabled);
    }

    deserializeLists(lists) {
        // Reset values to false
        Object.keys(this.flatNodes).forEach((value) => {
            Object.keys(lists).forEach((listKey) => {
                this.flatNodes[value][listKey] = false;
            });
        });

        // Deserialize values and set their nodes to true
        Object.keys(lists).forEach((listKey) => {
            lists[listKey].forEach((value) => {
                if (this.flatNodes[value] !== undefined) {
                    this.flatNodes[value][listKey] = true;
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

    expandAllNodes(expand) {
        Object.keys(this.flatNodes).forEach((value) => {
            if (this.flatNodes[value].isParent) {
                this.flatNodes[value].expanded = expand;
            }
        });

        return this;
    }

    toggleChecked(node, isChecked, noCascade) {
        const flatNode = this.flatNodes[node.value];

        if (flatNode.isLeaf || noCascade) {
            if (node.disabled) {
                return this;
            }

            // Set the check status of a leaf node or an uncoupled parent
            this.toggleNode(node.value, 'checked', isChecked);
        } else {
            // Percolate check status down to all children
            flatNode.self.children.forEach((child) => {
                this.toggleChecked(child, isChecked, noCascade);
            });
        }

        return this;
    }

    toggleNode(nodeValue, key, toggleValue) {
        this.flatNodes[nodeValue][key] = toggleValue;

        return this;
    }
}

export default NodeModel;
