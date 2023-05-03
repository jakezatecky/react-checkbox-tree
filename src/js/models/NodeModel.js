import NodeModelError from './NodeModelError';

const requiredProperties = ['label', 'value'];

class NodeModel {
    constructor(nodeConfig, parent, index, depth) {
        const checkRequiredProperty = (key) => {
            if (!(key in nodeConfig)) {
                throw new NodeModelError(
                    `Missing property '${key}' detected. All nodes must have a '${key}' property.`,
                );
            }
        };

        requiredProperties.forEach((prop) => {
            checkRequiredProperty(prop);
        });

        // TODO: is a shallow copy enough?

        // add all properties of nodeConfig to to new NodeModel
        Object.keys(nodeConfig).forEach((key) => {
            this[key] = nodeConfig[key];
        });

        // if node is instanceof NodeModel
        //   then we are doing a clone and are done
        //   otherwise check/add required properties

        if (!(nodeConfig instanceof NodeModel)) {
            // check for required properties and add missing ones;
            const isParent = Array.isArray(nodeConfig.children);

            // save node.value of children in this.childKeys
            // don't save reference to actual child nodes - mutation nightmare
            if (isParent) {
                this.childKeys = nodeConfig.children.map((child) => child.value);
                this.expanded = ('expanded' in nodeConfig) ? nodeConfig.expanded : false;
            } else {
                this.childKeys = null;
                this.expanded = false;
            }

            // remove unwanted properties copied from nodeConfig
            if ('children' in this) {
                delete this.children;
            }
            if ('checked' in this) {
                delete this.checked;
            }

            // nodeModel uses 'checkState' instead of 'checked' property
            // 'checkState' is kept current by TreeModel
            const checked = nodeConfig.checked !== undefined ? nodeConfig.checked : false;
            this.checkState = checked ? 1 : 0;

            this.parentKey = parent.value ? parent.value : '';
            this.isChild = parent.value !== undefined;
            this.isParent = isParent;
            this.isLeaf = !isParent;
            this.isRadioGroup = 'isRadioGroup' in nodeConfig ? nodeConfig.isRadioGroup : false;
            this.isRadioNode = 'isRadioGroup' in parent ? parent.isRadioGroup : false;
            this.isHiddenByFilter = false;

            this.disabled = 'disabled' in nodeConfig ? nodeConfig.disabled : false;
            this.icon = 'icon' in nodeConfig ? nodeConfig.icon : null;
            this.showCheckbox = 'showCheckbox' in nodeConfig ? nodeConfig.showCheckbox : true;

            this.index = index;
            this.treeDepth = depth;
        }
    }

    //---------------------------------------------------------
    clone() {
        return new NodeModel(this, this.parent, this.index, this.depth);
    }
}

export default NodeModel;
