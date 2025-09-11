import React from 'react';
import { createRoot } from 'react-dom/client';

import BasicExample from './js/BasicExample.jsx';
import CustomIconsExample from './js/CustomIconsExample.jsx';
import ClickableLabelsExample from './js/ClickableLabelsExample.jsx';
import DisabledExample from './js/DisabledExample.jsx';
import ExpandAllExample from './js/ExpandAllExample.jsx';
import HiddenCheckboxesExample from './js/HiddenCheckboxesExample.jsx';
import NoCascadeExample from './js/NoCascadeExample.jsx';
import LargeDataExample from './js/LargeDataExample.jsx';
import PessimisticToggleExample from './js/PessimisticToggleExample.jsx';
import FilterExample from './js/FilterExample.jsx';

createRoot(document.getElementById('basic-example')).render(<BasicExample />);
createRoot(document.getElementById('custom-icons-example')).render(<CustomIconsExample />);
createRoot(document.getElementById('disabled-example')).render(<DisabledExample />);
createRoot(document.getElementById('no-cascade-example')).render(<NoCascadeExample />);
createRoot(document.getElementById('pessimistic-toggle-example')).render(<PessimisticToggleExample />);
createRoot(document.getElementById('clickable-labels-example')).render(<ClickableLabelsExample />);
createRoot(document.getElementById('hidden-checkboxes-example')).render(<HiddenCheckboxesExample />);
createRoot(document.getElementById('expand-all-example')).render(<ExpandAllExample />);
createRoot(document.getElementById('large-data-example')).render(<LargeDataExample />);
createRoot(document.getElementById('filter-example')).render(<FilterExample />);
