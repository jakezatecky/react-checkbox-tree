import PropTypes from 'prop-types';

const nodeShape = {
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,

	icon: PropTypes.node,
};

const nodeShapeWithChildren = PropTypes.oneOfType([
	PropTypes.shape(nodeShape),
	PropTypes.shape({
		...nodeShape,
		children: PropTypes.arrayOf(nodeShape).isRequired,
	}),
]);

export default nodeShapeWithChildren;
