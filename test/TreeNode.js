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

	describe('expanded', () => {
		it('should render children when set to true', () => {
			const wrapper = shallow(
				<TreeNode
					checked={0}
					expanded
					label="Jupiter"
					optimisticToggle
					rawChildren={[{ value: 'europa', label: 'Europa' }]}
					treeId="id"
					value="jupiter"
					onCheck={() => {}}
					onExpand={() => {}}
				>
					<TreeNode
						checked={0}
						expanded={false}
						label="Europa"
						optimisticToggle
						treeId="id"
						value="europa"
						onCheck={() => {}}
						onExpand={() => {}}
					/>
				</TreeNode>,
			);

			assert.equal('europa', wrapper.find(TreeNode).prop('value'));
		});

		it('should not render children when set to false', () => {
			const wrapper = shallow(
				<TreeNode
					checked={0}
					expanded={false}
					label="Jupiter"
					optimisticToggle
					rawChildren={[{ value: 'europa', label: 'Europa' }]}
					treeId="id"
					value="jupiter"
					onCheck={() => {}}
					onExpand={() => {}}
				>
					<TreeNode
						checked={0}
						expanded={false}
						label="Europa"
						optimisticToggle
						treeId="id"
						value="europa"
						onCheck={() => {}}
						onExpand={() => {}}
					/>
				</TreeNode>,
			);

			assert.isFalse(wrapper.find(TreeNode).exists());
		});

		it('should render expanded icons when set to true', () => {
			const wrapper = shallow(
				<TreeNode
					checked={0}
					expanded
					label="Jupiter"
					optimisticToggle
					rawChildren={[{ value: 'europa', label: 'Europa' }]}
					treeId="id"
					value="jupiter"
					onCheck={() => {}}
					onExpand={() => {}}
				/>,
			);

			assert.isTrue(wrapper.contains(<i className="fa fa-chevron-down" />));
			assert.isTrue(wrapper.contains(<i className="fa fa-folder-open-o" />));
		});

		it('should render collapsed icons when set to false', () => {
			const wrapper = shallow(
				<TreeNode
					checked={0}
					expanded={false}
					label="Jupiter"
					optimisticToggle
					rawChildren={[{ value: 'europa', label: 'Europa' }]}
					treeId="id"
					value="jupiter"
					onCheck={() => {}}
					onExpand={() => {}}
				/>,
			);

			assert.isTrue(wrapper.contains(<i className="fa fa-chevron-right" />));
			assert.isTrue(wrapper.contains(<i className="fa fa-folder-o" />));
		});
	});
});
