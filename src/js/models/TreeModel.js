import TreeModelError from './TreeModelError';
import NodeModel from './NodeModel';
import { CHECK_MODEL } from '../constants';

class TreeModel {
    constructor(treeConfig, options = {
        checkModel: CHECK_MODEL.LEAF,
        noCascadeChecks: false,
        disabledCascade: true,
        optimisticToggle: true,
    }) {
        // function to flatten tree from a deep object to a flat object
        const flatten = (childNodes, parent = {}, depth = 0) => {
            if (Array.isArray(childNodes) && childNodes.length !== 0) {
                childNodes.forEach((node, index) => {
                    const newNode = new NodeModel(node, parent, index, depth);

                    if (newNode.isParent && node.children.length > 0) {
                        flatten(node.children, newNode, depth + 1);

                        // adjust checkState based upon children's checkState
                        if (!(newNode.isRadioGroup || newNode.isRadioNode)) {
                            const checkState = this.getCheckState(newNode);
                            newNode.checkState = checkState;
                        }
                    }

                    // check for bad radio group input
                    if (newNode.isRadioGroup) {
                        // TODO: should this have a default instead of Error?
                        //       like default to first checked
                        const numChecked = this.howManyChildrenChecked(newNode);
                        if (numChecked !== 1) {
                            // bad input for radio group
                            let textOption;
                            if (numChecked > 1) {
                                textOption = 'Too many children';
                            } else {
                                textOption = 'No children';
                            }
                            throw new TreeModelError(
                                `TreeModel.constructor Error: ${textOption} (${numChecked}) are checked in Node.isRadioGroup (${node.value}).`,
                            );
                        }
                    }

                    // Protect against duplicate node values
                    if (this.nodes[node.value] !== undefined) {
                        throw new TreeModelError(
                            `Duplicate value '${node.value}' detected. All node values must be unique.`,
                        );
                    }

                    this.nodes[node.value] = newNode;
                });
            }
        };
        //----------------------------------------------------------------------

        if (treeConfig instanceof TreeModel) {
            // this is a clone request
            this.rootKeys = [...treeConfig.rootKeys];
            this.unfilteredRootKeys = [...treeConfig.unfilteredRootKeys];
            this.options = { ...treeConfig.options };
            // NOTE: Individual nodes are not cloned. They are only cloned when
            //       actually changed to reduce TreeNode rerenders
            this.nodes = {};
            Object.keys(treeConfig.nodes).forEach((key) => {
                this.nodes[key] = treeConfig.nodes[key];
            });
        } else {
            // treeConfig is a nodeShape to be converted to TreeModel instance
            this.options = { ...options };

            // treeConfig is an array of nodes - save node.value as rootKeys
            // to allow walking of the tree recursively
            this.rootKeys = treeConfig.map((node) => node.value);
            // save a second copy to restore rootKeys when removing filter
            this.unfilteredRootKeys = [...this.rootKeys];
            this.nodes = {};

            // process the initial tree state into a TreeModel
            flatten(treeConfig);

            // at this point 'this' is a valid TreeModel and should be valid input for CheckboxTree
            // console.log(this);
        }
    }

    // TODO: figure out what functions should be public
    //--------------------------------------------------------------------------
    // Public functions

    /**
     * Clones the TreeModel instance.
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    clone() {
        return new TreeModel(this);
    }

    /**
     * Expands all parent nodes.
     *
     * @param {boolean} expandValue whether to expand (true) or compress (false) nodes
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    expandAllNodes(expandValue = true) {
        const newTree = this.clone();
        Object.keys(newTree.nodes).forEach((key) => {
            const newNode = this.getNode(key);
            if (newNode.isParent) {
                newNode.expanded = expandValue;
                newTree.nodes[key] = newNode;
            }
        });
        return newTree;
    }

    /**
     * Expands all parent nodes down to the targetLevel.
     *
     * @param {number} targetLevel How deep to expand the nodes.
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    expandNodesToLevel(targetLevel) {
        const newTree = this.clone();

        const expandLevels = (keys, currentLevel = 0) => {
            if (currentLevel > targetLevel) {
                return;
            }
            keys.forEach((key) => {
                const newNode = newTree.getNode(key).clone();
                if (newNode.isParent) {
                    newNode.expanded = true;
                    newTree.nodes[key] = newNode;
                    expandLevels(newNode.childKeys, currentLevel + 1);
                }
            });
        };

        expandLevels(newTree.rootKeys);
        return newTree;
    }

    /**
     * Filters the TreeModel instance based upon a test function.
     *
     * @param {function(nodeModel): boolean} testFunc Function which determines if the given
     *    node should be shown in the tree.
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    filter(testFunc) {
        if (typeof testFunc !== 'function') {
            // invalid value error
            throw new TreeModelError(
                `typeof first argument passed to TreeModel.filter (${typeof testFunc}) is not 'function'.`,
            );
        }

        const newTree = this.clone().removeFilter();

        const filterNodes = (filtered, nodeKey) => {
            const node = this.getNode(nodeKey);

            // process children first
            const childKeys = (node.childKeys || []).reduce(filterNodes, []);

            if (testFunc(node) || childKeys.length) {
                // passes testFunc or a child is a matching node
                // this node is a keeper
                filtered.push(node.value);
            } else {
                // hide the node
                const newNode = node.clone();
                newNode.isHiddenByFilter = true;
                newTree.nodes[nodeKey] = newNode;
            }
            return filtered;
        };

        newTree.rootKeys = newTree.rootKeys.reduce(filterNodes, []);
        return newTree;
    }

    /**
     * Returns the array of checked nodes based upon the checkModel value.
     *
     * @param {string} [checkModel] checkModel value oneOf ['leaf' || 'parent' || 'all']
     *
     * @param {boolean} [excludeDisabled = true] whether checked but disabled nodes will
     *    be included in array
     *
     * @returns {array.<string>} Array of node.value where the node is checked
     */
    getChecked(checkModel = '', excludeDisabled = true) {
        const checkedArray = [];
        const checkTest = checkModel || this.options.checkModel || CHECK_MODEL.LEAF;
        const { disabledCascade } = this.options;

        let testFn;
        if (checkTest === CHECK_MODEL.ALL) {
            testFn = (node) => (node.checkState > 0);
        } else if (checkTest === CHECK_MODEL.PARENT) {
            testFn = (node) => (node.isParent && node.checkState > 0);
        } else if (checkTest === CHECK_MODEL.LEAF) {
            testFn = (node) => (node.isLeaf && node.checkState > 0);
        } else {
            // invalid value error
            throw new TreeModelError(
                `Invalid value '${checkTest}' of checkModel in TreeModel.getChecked method.`,
            );
        }

        const walkTree = (nodeKey, ancestorDisabled = false) => {
            const node = this.getNode(nodeKey);
            const disabled = node.disabled || (disabledCascade && ancestorDisabled);

            if ((excludeDisabled && !disabled) && testFn(node)) {
                checkedArray.push(nodeKey);
            }
            if (node.isParent) {
                // ignore all nodes below an OFF radio group
                // ignore all nodes below an OFF radio button
                // NOT ( off && (node.isRadioGroup or node.isRadioNode))
                // TODO: should the above be switchable on/off?
                //       ignoreCheckedBelowRadioOff: default to true
                if (!((node.checkState === 0) && (node.isRadioGroup || node.isRadioNode))) {
                    node.childKeys.forEach((key) => {
                        walkTree(key, disabled);
                    });
                }
            }
        };

        this.rootKeys.forEach((key) => {
            walkTree(key);
        });

        return checkedArray;
    }

    /**
     * Returns the array of disabled nodes
     *
     * @param {boolean} [disabledCascade = this.options.disabledCascade] optional parameter
     *    to override the default value from this.options
     *
     * @returns {array.<string>} Array of node.value where the node is disabled
     */
    getDisabled(disabledCascade = this.options.disabledCascade) {
        const disabledArray = [];

        // TODO: what about radio nodes here?

        const walkTree = (nodeKey, ancestorDisabled = false) => {
            const node = this.getNode(nodeKey);
            const disabled = node.disabled || (disabledCascade && ancestorDisabled);
            if (disabled) {
                disabledArray.push(nodeKey);
            }
            if (node.childKeys) {
                node.childKeys.forEach((key) => {
                    walkTree(key, disabled);
                });
            }
        };

        this.rootKeys.forEach((key) => {
            walkTree(key);
        });

        return disabledArray;
    }

    /**
     * Returns the array of expanded nodes
     *
     * @returns {array.<string>} Array of node.value where the node is expanded
     */
    getExpanded() {
        // includes expanded children with parent collapsed
        // TODO: should this include above children?
        const expandedArray = [];
        Object.keys(this.nodes).forEach((key) => {
            if (this.nodes[key].expanded) {
                expandedArray.push(key);
            }
        });
        return expandedArray;
    }

    /**
     * Returns the node with node.value === nodeKey
     *
     * @param {string} nodeKey value property of desired node
     *
     * @returns {NodeModel}
     */
    getNode(nodeKey) {
        return this.nodes[nodeKey];
    }

    /**
     * Removes a filter from the TreeModel instance
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    removeFilter() {
        const newTree = this.clone();

        Object.keys(newTree.nodes).forEach((key) => {
            const newNode = this.getNode(key);
            newNode.isHiddenByFilter = false;
            newTree.nodes[key] = newNode;
        });
        newTree.rootKeys = [...this.unfilteredRootKeys];

        return newTree;
    }

    setNodeProp(nodeKey, propertyName, value) {
        const newTree = this.clone();
        const newNode = this.getNode(nodeKey).clone();
        newNode[propertyName] = value;
        newTree.nodes[nodeKey] = newNode;
        return newTree;
    }

    /**
     * Toggles the checked property of the node with node.value === nodeKey
     *
     * @param {string} nodeKey value property of desired node
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    toggleChecked(nodeKey) {
        // TODO: should these options be able to be overidden with an options argument
        const { disabledCascade, noCascadeChecks, optimisticToggle } = this.options;
        const node = this.getNode(nodeKey);

        if (node.disabled || (disabledCascade && this.hasDisabledAncestor(node)) ||
            // do nothing if radio node is already selected
            ((node.isRadioNode) && (node.checkState > 0))
        ) {
            // TODO: should this be return FALSE?
            // no change return old tree
            return this;
        }

        const newTree = this.clone();

        // determine newCheckState for this node
        let newCheckState;
        if (node.isRadioNode) {
            // turn off all siblings of node in newTree
            newTree.turnOffSiblings(nodeKey);
            newCheckState = 1;
        } else if (node.checkState === 2) {
            newCheckState = (optimisticToggle && !noCascadeChecks) ? 1 : 0;
        } else {
            newCheckState = (node.checkState > 0) ? 0 : 1;
        }

        //----------------------------------------------------------------------
        // recursive function to handle toggle on node and children
        // defined here because it uses newCheckState & newTree from above
        const toggle = (key) => {
            const newNode = this.getNode(key).clone();
            if (noCascadeChecks ||
                newNode.isLeaf ||
                newNode.childKeys.length === 0 ||
                newNode.isRadioGroup ||
                newNode.isRadioNode
            ) {
                newNode.checkState = newCheckState;
            } else {
                // toggle child nodes first
                newNode.childKeys.forEach((childKey) => {
                    toggle(childKey, newCheckState);
                });
                // get checkState based upon childNodes' checkState
                newNode.checkState = newTree.getCheckState(newNode);
            }
            newTree.nodes[key] = newNode;
        };
        //----------------------------------------------------------------------

        toggle(nodeKey);

        // Percolate check status up to parents
        // if child isRadioNode do not percolate up
        if (!(noCascadeChecks || node.isRadioNode)) {
            let child = node;
            while (child.parentKey !== '') {
                const { parentKey } = child;
                const newParent = newTree.getNode(parentKey).clone();
                if (newParent.isRadioNode) {
                    break; // do not percolate up
                } else {
                    newParent.checkState = newTree.getCheckState(newParent);
                    newTree.nodes[parentKey] = newParent;
                    child = newParent;
                }
            }
        }

        return newTree;
    }

    /**
     * Toggles the disabled property of the node with node.value === nodeKey
     *
     * @param {string} nodeKey value property of desired node
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    toggleDisabled(nodeKey) {
        return this.toggleProperty(nodeKey, 'disabled');
    }

    /**
     * Toggles the expanded property of the node with node.value === nodeKey
     *
     * @param {string} nodeKey value property of desired node
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    toggleExpanded(nodeKey) {
        return this.toggleProperty(nodeKey, 'expanded');
    }

    /**
     * Updates the options property of the TreeModel instance.
     *
     * @param {object} newOptions object containing the new options
     *
     * @returns {TreeModel} updated TreeModel instance
     */
    updateOptions(newOptions) {
        const newTree = this.clone();
        newTree.options = { ...newTree.options, ...newOptions };
        return newTree;
    }

    // Private functions
    //--------------------------------------------------------------------------

    getCheckState(node) {
        if (this.isEveryChildChecked(node)) {
            return 1;
        }
        if (this.isSomeChildChecked(node)) {
            return node.isRadioGroup ? 1 : 2;
        }
        return 0;
    }

    hasDisabledAncestor(node) {
        let child = node;

        let disabled = false;
        while (child && child.isChild && !disabled) {
            const parent = this.getNode(child.parentKey);
            disabled = (parent && (parent.disabled ||
                // all children below a 'not selected' radio node are disabled
                ((parent.isRadioNode) && (parent.checkState === 0))
            ));
            child = parent;
        }
        return disabled;
    }

    howManyChildrenChecked(node) {
        return node.childKeys.filter((childKey) => this.getNode(childKey).checkState !== 0).length;
    }

    isEveryChildChecked(node) {
        return node.childKeys.every((childKey) => this.getNode(childKey).checkState === 1);
    }

    isNoChildChecked(node) {
        return node.childKeys.every((childKey) => this.getNode(childKey).checkState === 0);
    }

    isSomeChildChecked(node) {
        return node.childKeys.some((childKey) => this.getNode(childKey).checkState > 0);
    }

    toggleProperty(nodeKey, propertyName) {
        const newNode = this.getNode(nodeKey).clone();
        const newValue = !newNode[propertyName];
        newNode[propertyName] = newValue;

        const newTree = this.clone();
        newTree.nodes[nodeKey] = newNode;

        return newTree;
    }

    // this method is private and does not handle cascading
    // as it is used specifically for radioGroup nodes
    // to turn off all sibling nodes before turning on the clicked one
    turnOffSiblings(nodeKey) {
        const { parentKey } = this.getNode(nodeKey);
        this.getNode(parentKey).childKeys.forEach((childKey) => {
            if (childKey !== nodeKey) {
                const newNode = this.getNode(childKey).clone();
                newNode.checkState = 0;
                this.nodes[childKey] = newNode;
            }
        });
    }
}

export default TreeModel;
