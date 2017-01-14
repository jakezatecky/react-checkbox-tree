import React from 'react';

export default {
	value: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
	]),
	title: React.PropTypes.string,
};
