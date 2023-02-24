import PropTypes from 'prop-types';

export default PropTypes.shape({
    collapseAll: PropTypes.string.isRequired,
    collapseNode: PropTypes.string.isRequired,
    expandAll: PropTypes.string.isRequired,
    expandNode: PropTypes.string.isRequired,
});
