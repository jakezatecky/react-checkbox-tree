/**
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

// eslint-disable-next-line import/prefer-default-export
export { expandNodesToLevel };
