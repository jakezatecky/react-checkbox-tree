import React from 'react';
import { createRoot } from 'react-dom/client';

import BasicExample from './js/BasicExample';
import ClickableLabelsExample from './js/ClickableLabelsExample';
import CustomIconsExample from './js/CustomIconsExample';
import DisabledExample from './js/DisabledExample';
import ExpandAllExample from './js/ExpandAllExample';
import FilterExample from './js/FilterExample';
import HiddenCheckboxesExample from './js/HiddenCheckboxesExample';
import LargeDataExample from './js/LargeDataExample';
import NativeCheckboxExample from './js/NativeCheckboxExample';
import NoCascadeExample from './js/NoCascadeExample';
import PessimisticToggleExample from './js/PessimisticToggleExample';
import RadioButtonExample from './js/RadioButtonExample';

createRoot(document.getElementById('basic-example')).render(<BasicExample />);
createRoot(document.getElementById('clickable-labels-example')).render(<ClickableLabelsExample />);
createRoot(document.getElementById('custom-icons-example')).render(<CustomIconsExample />);
createRoot(document.getElementById('disabled-example')).render(<DisabledExample />);
createRoot(document.getElementById('expand-all-example')).render(<ExpandAllExample />);
createRoot(document.getElementById('filter-example')).render(<FilterExample />);
createRoot(document.getElementById('hidden-checkboxes-example')).render(<HiddenCheckboxesExample />);
createRoot(document.getElementById('large-data-example')).render(<LargeDataExample />);
createRoot(document.getElementById('native-checkboxes-example')).render(<NativeCheckboxExample />);
createRoot(document.getElementById('no-cascade-example')).render(<NoCascadeExample />);
createRoot(document.getElementById('pessimistic-toggle-example')).render(<PessimisticToggleExample />);
createRoot(document.getElementById('radio-button-example')).render(<RadioButtonExample />);
