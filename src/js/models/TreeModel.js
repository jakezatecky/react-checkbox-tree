import TreeModelError from './TreeModelError';
import NodeModel from './NodeModel';
import { CHECK_MODEL } from '../constants';

class TreeModel {
    constructor(treeConfig, options = {}) {
        const flatten = (childNodes, parent = {}, depth = 0) => {
            if (Array.isArray(childNodes) && childNodes.length !== 0) {
                childNodes.forEach((node, index) => {
                    const newNode = new NodeModel(node, parent, index, depth, options);
                    // TODO: fix disabled - for all nodes? options.disabled?
                    if (newNode.isChild) {
                        if ('disabled' in parent) {
                            newNode.disabled = parent.disabled;
                        }
                    }
                    if (newNode.isParent && node.children.length > 0) {
                        flatten(node.children, node, depth + 1);

                        // adjust checkState based upon children's checkState
                        if (newNode.isRadioGroup) {
                            // TODO: should this have a default instead of Error
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
                        } else if (!newNode.isRadioNode) {
                            // this is for parent nodes with children
                            const checkState = this.getCheckState(newNode);
                            newNode.checkState = checkState;
                        }
                        // else if newNode.isRadioNode => do nothing
                    }

                    // Protect against duplicate node values
                    if (this.tree[node.value] !== undefined) {
                        throw new TreeModelError(
                            `Duplicate value '${node.value}' detected. All node values must be unique.`,
                        );
                    }

                    this.tree[node.value] = newNode;
                });
            }
        };
        //----------------------------------------------------------------------

        if (treeConfig instanceof TreeModel) {
            // this is a clone request
            // NOTE: nodes are not cloned. They are only cloned when
            //       actually changed to reduce TreeNode rerenders
            this.tree = {};
            this.rootKeys = [...treeConfig.rootKeys];
            this.unfilteredRootKeys = [...treeConfig.unfilteredRootKeys];
            this.options = { ...treeConfig.options };
            Object.keys(treeConfig.tree).forEach((key) => {
                this.tree[key] = treeConfig.tree[key];
            });
        } else {
            // these are options passed from CheckboxTree
            this.options = { ...options };

            // treeConfig is an array of nodes - save node.value as rootKeys
            // to allow walking of the tree recursively
            this.rootKeys = treeConfig.map((node) => node.value);
            // save a second copy to restore rootKeys when removing filter
            this.unfilteredRootKeys = [...this.rootKeys];
            this.tree = {};

            // process the initial tree state into a TreeModel
            flatten(treeConfig);

            // at this point 'this' is a valid TreeModel and should be valid input for CheckboxTree
        }
    }

    // TODO: figure out what functions should be public
    //--------------------------------------------------------------------------
    // Public functions

    clone() {
        return new TreeModel(this);
    }

    expandAllNodes(expandValue = true) {
        const newTreeModel = this.clone();
        Object.keys(newTreeModel.tree).forEach((key) => {
            const newNode = this.getNode(key);
            if (newNode.isParent) {
                newNode.expanded = expandValue;
                newTreeModel.tree[key] = newNode;
            }
        });
        return newTreeModel;
    }

    /**
     * Returns an updated TreeModel.
     *
     * @param {number} targetLevel How deep to expand the nodes.
     *
     * @returns {TreeModel}
     */
    expandNodesToLevel(targetLevel) {
        const newTreeModel = this.clone();

        const expandLevels = (node, currentLevel = 0) => {
            if (currentLevel > targetLevel) {
                return;
            }
            Object.keys(newTreeModel.tree).forEach((key) => {
                const newNode = newTreeModel.getNode[key].clone();
                if (newNode.isParent) {
                    newNode.expanded = true;
                    newTreeModel.tree[key] = newNode;
                    expandLevels(newNode, currentLevel + 1);
                }
            });
        };

        expandLevels(targetLevel);
        return newTreeModel;
    }

    filter(testFunc) {
        if (typeof testFunc !== 'function') {
            // invalid value error
            throw new TreeModelError(
                `typeof first argument passed to TreeModel.filter (${typeof testFunc}) is not 'function'.`,
            );
        }

        const newTreeModel = this.clone().removeFilter();

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
                newTreeModel.tree[nodeKey] = newNode;
            }
            return filtered;
        };

        newTreeModel.rootKeys = newTreeModel.rootKeys.reduce(filterNodes, []);
        this.options.setTreeModel(newTreeModel);
        return newTreeModel;
    }

    // includes expanded children with parent collapsed
    getExpanded() {
        const expandedArray = [];
        Object.keys(this.tree).forEach((key) => {
            if (this.tree[key].expanded) {
                expandedArray.push(key);
            }
        });
        return expandedArray;
    }

    getChecked() {
        const checkModel = this.options.checkModel || CHECK_MODEL.LEAF;
        const checkedArray = [];

        let test;
        if (checkModel === CHECK_MODEL.ALL) {
            test = (node) => (node.checkState > 0);
        } else if (checkModel === CHECK_MODEL.PARENT) {
            test = (node) => (node.isParent && node.checkState > 0);
        } else if (checkModel === CHECK_MODEL.LEAF) {
            test = (node) => (node.isLeaf && node.checkState > 0);
        } else {
            // invalid value error
            throw new TreeModelError(
                `Invalid value '${checkModel}' of checkModel in TreeModel.getChecked method.`,
            );
        }

        const walkTree = (nodeKey) => {
            const node = this.getNode(nodeKey);
            if (test(node) && !node.disabled) {
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
                        walkTree(key);
                    });
                }
            }
        };

        this.rootKeys.forEach((key) => {
            walkTree(key);
        });

        return checkedArray;
    }

    /*
    // with no radio nodes this works
    getChecked_old() {
        const checkModel = this.options.checkModel || CHECK_MODEL.LEAF;
        const checkedArray = [];
        const keys = Object.keys(this.tree);

        const pushCheckedKeys = (testFn) => {
            keys.forEach((key) => {
                const node = this.getNode(key);
                if (testFn(node)) {
                    checkedArray.push(key);
                }
            });
        };

        let test;
        if (checkModel === CHECK_MODEL.ALL) {
            test = (node) => (node.checkState > 0);
        } else if (checkModel === CHECK_MODEL.PARENT) {
            test = (node) => (node.isParent && node.checkState > 0);
        } else if (checkModel === CHECK_MODEL.LEAF) {
            test = (node) => (node.isLeaf && node.checkState > 0);
        } else {
            // invalid value error
            throw new TreeModelError(
                `Invalid value '${checkModel}' passed to TreeModel.getChecked method.`,
            );
        }

        pushCheckedKeys(test);
        return checkedArray;
    }
    */

    getNode(nodeKey) {
        return this.tree[nodeKey];
    }

    removeFilter() {
        const newTreeModel = this.clone();

        Object.keys(newTreeModel.tree).forEach((key) => {
            const newNode = this.getNode(key);
            newNode.isHiddenByFilter = false;
            newTreeModel.tree[key] = newNode;
        });
        newTreeModel.rootKeys = [...this.unfilteredRootKeys];

        return newTreeModel;
    }

    toggleChecked(nodeKey) {
        const node = this.getNode(nodeKey);

        // NOTE: disabled may not be needed here
        //       toggleChecked does not get called if node is disabled
        if (node.disabled ||
            ((node.isRadioNode) && (node.checkState > 0))
        ) {
            // TODO: should this be return FALSE?
            // no change return old treeModel
            return this;
        }

        const newTreeModel = this.clone();
        const newTree = newTreeModel.tree;

        // determine newCheckState
        let newCheckState;
        if (node.isRadioNode) {
            // turn off all siblings of node in newTree
            newTreeModel.turnOffSiblings(nodeKey);
            newCheckState = 1;
        } else if (node.checkState === 2) {
            newCheckState = this.options.optimisticToggle ? 1 : 0;
        } else {
            newCheckState = (node.checkState > 0) ? 0 : 1;
        }

        //----------------------------------------------------------------------
        // recursive function to handle toggle
        // defined here because it uses newCheckState & newTree from above
        const toggle = (key) => {
            const newNode = this.getNode(key).clone();
            if (this.options.noCascade ||
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
                // get checkState based upon childNodes checkState
                newNode.checkState = newTreeModel.getCheckState(newNode);
            }
            newTree[key] = newNode;
        };
        //----------------------------------------------------------------------

        toggle(nodeKey);

        // Percolate check status up to parents
        // if child isRadioNode do not percolate up
        if (!(this.options.noCascade || node.isRadioNode)) {
            let child = node;
            while (child.parentKey !== '') {
                const { parentKey } = child;
                const newParent = newTreeModel.getNode(parentKey).clone();
                if (newParent.isRadioNode) {
                    // do not percolate up
                    break;
                } else {
                    newParent.checkState = newTreeModel.getCheckState(newParent);
                    newTree[parentKey] = newParent;
                    child = newParent;
                }
            }
        }

        return newTreeModel;
    }

    toggleDisabled(nodeKey) {
        // TODO: what about this.options.noCascade?
        const toggleChildren = true;
        const newTreeModel = this.toggleProperty(nodeKey, 'disabled', toggleChildren);
        return newTreeModel;
    }

    toggleExpanded(nodeKey) {
        const toggleChildren = false;
        const newTreeModel = this.toggleProperty(nodeKey, 'expanded', toggleChildren);
        return newTreeModel;
    }

    //--------------------------------------------------------------------------
    // Private functions

    getCheckState(node) {
        if (this.isEveryChildChecked(node)) {
            return 1;
        }
        if (this.isSomeChildChecked(node)) {
            return node.isRadioGroup ? 1 : 2;
        }
        return 0;
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

    toggleProperty(nodeKey, propertyName, toggleChildren = false) {
        const newNode = this.getNode(nodeKey).clone();
        const newValue = !newNode[propertyName];
        newNode[propertyName] = newValue;

        const newTreeModel = this.clone();
        const newTree = newTreeModel.tree;
        newTree[nodeKey] = newNode;

        if (toggleChildren && newNode.isParent) {
            newNode.childKeys.forEach((childKey) => {
                const node = this.getNode(childKey).clone();
                node[propertyName] = newValue;
                newTree[childKey] = node;
            });
        }

        return newTreeModel;
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
                this.tree[childKey] = newNode;
            }
        });
    }

    //--------------------------------------------------------------------------
    // TODO: these functions need review

    getDisabledState(nodeKey, disabledProp, noCascade) {
        // TODO: how to handle disabledProp and noCascade
        //       are they in this.options? or passed
        const node = this.getNode(nodeKey);
        const parent = this.getNode(node.parentKey);
        if (disabledProp) {
            return true;
        }

        if (!noCascade && parent.disabled) {
            return true;
        }

        return Boolean(node.disabled);
    }
}

export default TreeModel;
