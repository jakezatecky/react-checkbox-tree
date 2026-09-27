import { CHECK_MODEL } from '#js/constants.js';

/**
 * Return a list of all parent node keys up until `targetLevel`.
 *
 * @param {Array} nodes The nodes to traverse.
 * @param {number} targetLevel How deep to expand the nodes.
 * @param {int} currentLevel The current level in the recursive chain.
 *
 * @returns {Array}
 */
function expandNodesToLevel(nodes, targetLevel, currentLevel = 0) {
    if (currentLevel > targetLevel) {
        return [];
    }

    let expanded = [];
    nodes.forEach((node) => {
        if (node.children) {
            expanded = [
                ...expanded,
                node.value,
                ...expandNodesToLevel(node.children, targetLevel, currentLevel + 1),
            ];
        }
    });

    return expanded;
}

/**
 * Return a list of node values that fully checks every enabled node in the tree.
 *
 * @param {Array} nodes The nodes to traverse.
 * @param {Object} options
 * @param {string} options.checkModel The `checkModel` passed to the tree (`'leaf'` or `'all'`).
 * @param {boolean} options.noCascade The `noCascade` value passed to the tree.
 *
 * @returns {Array}
 */
function checkAllNodes(nodes, { checkModel = CHECK_MODEL.LEAF, noCascade = false } = {}) {
    function checkNode(node, parentDisabled) {
        const disabled = Boolean(node.disabled) || (!noCascade && parentDisabled);
        const children = Array.isArray(node.children) ? node.children : null;
        const childResults = (children || []).map((child) => checkNode(child, disabled));
        const childValues = childResults.flatMap((result) => result.values);

        // Leaves, empty parents, and uncascaded nodes track their own state
        if (children === null || children.length === 0 || noCascade) {
            return {
                checked: !disabled,
                values: disabled ? childValues : [node.value, ...childValues],
            };
        }

        // Otherwise, a parent is only checked when all of its children are
        const checked = childResults.every((result) => result.checked);
        const includeSelf = checked && checkModel === CHECK_MODEL.ALL;

        return {
            checked,
            values: includeSelf ? [node.value, ...childValues] : childValues,
        };
    }

    return nodes.flatMap((node) => checkNode(node, false).values);
}

export { checkAllNodes, expandNodesToLevel };
