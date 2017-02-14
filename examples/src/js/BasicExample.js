import React from 'react';

import Tree from '../../../src/js/Tree';

const nodes = [
	{
		value: '/app',
		title: 'app',
		children: [
			{
				value: '/app/Http',
				title: 'Http',
				children: [
					{
						value: '/app/Http/Controllers',
						title: 'Controllers',
						children: [{
							value: '/app/Http/Controllers/WelcomeController.js',
							title: 'WelcomeController.js',
						}],
					},
					{
						value: '/app/Http/routes.js',
						title: 'routes.js',
					},
				],
			},
			{
				value: '/app/Providers',
				title: 'Providers',
				children: [{
					value: '/app/Http/Providers/EventServiceProvider.js',
					title: 'EventServiceProvider.js',
				}],
			},
		],
	},
	{
		value: '/config',
		title: 'config',
		children: [
			{
				value: '/config/app.js',
				title: 'app.js',
			},
			{
				value: '/config/database.js',
				title: 'database.js',
			},
		],
	},
	{
		value: '/public',
		title: 'public',
		children: [
			{
				value: '/public/assets/',
				title: 'assets',
				children: [{
					value: '/public/assets/style.css',
					title: 'style.css',
				}],
			},
			{
				value: '/public/index.html',
				title: 'index.html',
			},
		],
	},
	{
		value: '/.env',
		title: '.env',
	},
	{
		value: '/.gitignore',
		title: '.gitignore',
	},
	{
		value: '/README.md',
		title: 'README.md',
	},
];

class BasicExample extends React.Component {
	constructor() {
		super();

		this.state = {
			checked: [
				'/app/Http/Controllers/WelcomeController.js',
				'/app/Http/routes.js',
				'/public/assets/style.css',
				'/public/index.html',
				'/.gitignore',
			],
			expanded: [
				'/app',
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
			<Tree
				checked={checked}
				expanded={expanded}
				name="airports"
				nodes={nodes}
				onCheck={this.onCheck}
				onExpand={this.onExpand}
			/>
		);
	}
}

export default BasicExample;
