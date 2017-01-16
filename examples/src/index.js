import React from 'react';
import ReactDOM from 'react-dom';

import Tree from '../../src/js/Tree';

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
							value: '/app/Http/Controllers/WelcomeController.php',
							title: 'WelcomeController.php',
						}],
					},
					{
						value: '/app/Http/routes.php',
						title: 'routes.php',
					},
				],
			},
			{
				value: '/app/Providers',
				title: 'Providers',
				children: [{
					value: '/app/Http/Providers/EventServiceProvider.php',
					title: 'EventServiceProvider.php',
				}],
			},
		],
	},
	{
		value: '/config',
		title: 'config',
		children: [
			{
				value: '/config/app.php',
				title: 'app.php',
			},
			{
				value: '/config/database.php',
				title: 'database.php',
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

class Widget extends React.Component {
	constructor() {
		super();

		this.state = {
			checked: [
				'/app/Http/Controllers/WelcomeController.php',
				'/app/Http/routes.php',
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

ReactDOM.render(<Widget />, document.getElementById('mount'));
