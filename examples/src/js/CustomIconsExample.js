import React from 'react';

import CheckboxTree from '../../../src/index';

const nodes = [
	{
		value: 'Documents',
		label: 'Documents',
		children: [
			{
				value: 'Employee Evaluations.zip',
				label: 'Employee Evaluations.zip',
				icon: <i className="fa fa-file-archive-o" />,
			},
			{
				value: 'Expense Report.pdf',
				label: 'Expense Report.pdf',
				icon: <i className="fa fa-file-pdf-o" />,
			},
			{
				value: 'notes.txt',
				label: 'notes.txt',
				icon: <i className="fa fa-file-text-o" />,
			},
		],
	},
	{
		value: 'Photos',
		label: 'Photos',
		children: [
			{
				value: 'nyan-cat.gif',
				label: 'nyan-cat.gif',
				icon: <i className="fa fa-file-image-o" />,
			},
			{
				value: 'SpaceX Falcon9 liftoff.jpg',
				label: 'SpaceX Falcon9 liftoff.jpg',
				icon: <i className="fa fa-file-image-o" />,
			},
		],
	},
];

class CustomIconsExamples extends React.Component {
	constructor() {
		super();

		this.state = {
			checked: [],
			expanded: [
				'Documents',
			],
		};

		this.onCheck = this.onCheck.bind(this);
		this.onExpand = this.onExpand.bind(this);
	}

	onCheck(checked) {
		this.setState({ checked });
	}

	onExpand(expanded) {
		this.setState({ expanded });
	}

	render() {
		const { checked, expanded } = this.state;

		return (
			<CheckboxTree
				checked={checked}
				expanded={expanded}
				nodes={nodes}
				onCheck={this.onCheck}
				onExpand={this.onExpand}
			/>
		);
	}
}

export default CustomIconsExamples;
