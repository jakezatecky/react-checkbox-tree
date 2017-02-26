import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';

import TreeNode from '../src/js/TreeNode';

describe('<TreeNode />', () => {
	describe('component', () => {
		it('should render the rct-node container', () => {
			const wrapper = shallow(
				<TreeNode
					checked={0}
					expanded={false}
					label="Europa"
					optimisticToggle
					treeId="id"
					value="europa"
					onCheck={() => {}}
					onExpand={() => {}}
				/>,
			);

			assert.isTrue(wrapper.find('.rct-node').exists());
		});
	});

	describe('label', () => {
		it('should render the node\'s label', () => {
			const wrapper = shallow(
				<TreeNode
					checked={0}
					expanded={false}
					label="Europa"
					optimisticToggle
					treeId="id"
					value="europa"
					onCheck={() => {}}
					onExpand={() => {}}
				/>,
			);

			assert.isTrue(wrapper.contains(
				<span className="rct-title">Europa</span>,
			));
		});
	});
});
