import React from 'react';

const nodeShape = {
	label: React.PropTypes.string.isRequired,
	value: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
	]).isRequired,

	icon: React.PropTypes.node,
};

const nodeShapeWithChildren = React.PropTypes.oneOfType([
	React.PropTypes.shape(nodeShape),
	React.PropTypes.shape({
		...nodeShape,
		children: React.PropTypes.arrayOf(nodeShape).isRequired,
	}),
]);

export default nodeShapeWithChildren;
