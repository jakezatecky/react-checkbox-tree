import PropTypes from 'prop-types';
import nodeShape from './nodeShape';

const treeShape = PropTypes.shape({
    tree: PropTypes.shape(nodeShape),
    rootKey: PropTypes.string,
    options: PropTypes.shape({}),
});

export default treeShape;
