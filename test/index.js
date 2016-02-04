import React from 'react';
import ReactDOM from 'react-dom';

import Tree from '../src/js/Tree';

const nodes = [
	{
		value: 'level-1',
		title: 'Level 1',
		children: [
			{
				value: 'level-1-1',
				title: 'Level 1-1',
			},
		],
	},
	{
		value: 'level-2',
		title: 'Level 2',
		children: [
			{
				value: 'level-2-1',
				title: 'Level 2-1',
				children: [
					{
						value: 'level-2-1-1',
						title: 'Level 2-1-1',
					},
					{
						value: 'level-2-1-2',
						title: 'Level 2-1-2',
					},
				],
			},
			{
				value: 'level-2-2',
				title: 'Level 2-2',
			},
			{
				value: 'level-2-3',
				title: 'Level 2-3',
			},
		],
	},
	{
		value: 'level-3',
		title: 'Level 3',
		children: [],
	},
	{
		value: 'level-4',
		title: 'Level 4',
		children: [
			{
				value: 'level-4-1',
				title: 'Level 4-1',
			},
		],
	},
];
const checked = ['level-2-1-1', 'level-2-1-2', 'level-2-2', 'level-3'];

ReactDOM.render(<Tree nodes={nodes} checked={checked} />, document.getElementById('mount'));
