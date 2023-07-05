import TreeModelError from './TreeModelError';
import NodeModel from './NodeModel';
import { CHECK_MODEL } from '../constants';

class TreeModel {
    constructor(treeConfig, options = {
        checkModel: CHECK_MODEL.LEAF,
        noCascadeChecks: false,
        noCascadeDisabled: false,
        optimisticToggle: true,
    }) {
        const { noCascadeDisabled } = options;

        //----------------------------------------------------------------------
        // function to flatten tree from a deep object to a flat object
        const flatten = (childNodes, parent = {}, depth = 0) => {
            if (Array.isArray(childNodes) && childNodes.length !== 0) {
                childNodes.forEach((node, index) => {
                    const newNode = new NodeModel(node, parent, index, depth);

                    // cascade disabled property down to children
                    // this makes tree have consistent disabled state
                    // this already happens in treeNode if noCascadeDisabled = false
                    if (!noCascadeDisabled) {
                        newNode.disabled = parent.disabled || newNode.disabled;
                    }

                    // noCascadeChecks is not relevant here
                    // noCascadeDisabled is
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
            // NOTE: nodes are not cloned. They are only cloned when
            //       actually changed to reduce TreeNode rerenders
            this.rootKeys = [...treeConfig.rootKeys];
            this.unfilteredRootKeys = [...treeConfig.unfilteredRootKeys];
            this.options = { ...treeConfig.options };
            this.nodes = {};
            Object.keys(treeConfig.nodes).forEach((key) => {
                this.nodes[key] = treeConfig.nodes[key];
            });
        } else {
            // treeConfig is a nodeShape
            // these are options passed from CheckboxTree
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

    clone() {
        return new TreeModel(this);
    }

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
     * Returns an updated TreeModel.
     *
     * @param {number} targetLevel How deep to expand the nodes.
     *
     * @returns {TreeModel}
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

    getChecked() {
        // TODO: should this method have a checkModel argument to override
        //       the one in options
        const { checkModel } = this.options;
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
            if (!node.disabled && test(node)) {
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
        const keys = Object.keys(this.nodes);

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

    getDisabled() {
        const disabledArray = [];
        Object.keys(this.nodes).forEach((key) => {
            if (this.nodes[key].disabled) {
                disabledArray.push(key);
            }
        });
        return disabledArray;
    }

    // includes expanded children with parent collapsed
    getExpanded() {
        const expandedArray = [];
        Object.keys(this.nodes).forEach((key) => {
            if (this.nodes[key].expanded) {
                expandedArray.push(key);
            }
        });
        return expandedArray;
    }

    getNode(nodeKey) {
        return this.nodes[nodeKey];
    }

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

    toggleChecked(nodeKey) {
        // TODO: should these options be able to be overidden with an options argument
        const { noCascadeChecks, optimisticToggle } = this.options;
        const node = this.getNode(nodeKey);

        // NOTE: disabled may not be needed here
        //       toggleChecked does not get called if node is disabled
        if (node.disabled ||
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
                    // do not percolate up
                    break;
                } else {
                    newParent.checkState = newTree.getCheckState(newParent);
                    newTree.nodes[parentKey] = newParent;
                    child = newParent;
                }
            }
        }

        return newTree;
    }

    toggleDisabled(nodeKey) {
        const toggleChildren = !this.options.noCascadeDisabled;
        const newTree = this.toggleProperty(nodeKey, 'disabled', toggleChildren);
        return newTree;
    }

    toggleExpanded(nodeKey) {
        const toggleChildren = false;
        const newTree = this.toggleProperty(nodeKey, 'expanded', toggleChildren);
        return newTree;
    }

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

        const newTree = this.clone();
        newTree.nodes[nodeKey] = newNode;

        if (toggleChildren && newNode.isParent) {
            newNode.childKeys.forEach((childKey) => {
                const node = this.getNode(childKey).clone();
                node[propertyName] = newValue;
                newTree.nodes[childKey] = node;
            });
        }

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
