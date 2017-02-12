import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';

import CheckboxTree from '../src/js/Tree';

describe('<CheckboxTree />', () => {
	describe('component', () => {
		it('should render the react-checkbox-tree container', () => {
			const wrapper = shallow(
				<CheckboxTree
					checked={[]}
					expanded={[]}
					nodes={[]}
					onCheck={() => {}}
					onExpand={() => {}}
				/>,
			);

			assert.isTrue(wrapper.find('.react-checkbox-tree').exists());
		});
	});
});

