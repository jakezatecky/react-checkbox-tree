import React from 'react';

const nodeShape = {
	value: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
	]).isRequired,
	label: React.PropTypes.string.isRequired,
};

const nodeShapeWithChildren = React.PropTypes.oneOfType([
	React.PropTypes.shape(nodeShape),
	React.PropTypes.shape({
		...nodeShape,
		children: React.PropTypes.arrayOf(nodeShape).isRequired,
	}),
]);

export default nodeShapeWithChildren;
