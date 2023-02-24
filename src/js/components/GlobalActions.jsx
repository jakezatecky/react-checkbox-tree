import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { IconContext, LanguageContext } from '../contexts';
import Button from './Button';

const propTypes = {
    onCollapseAll: PropTypes.func.isRequired,
    onExpandAll: PropTypes.func.isRequired,
};

function GlobalActions({ onExpandAll, onCollapseAll }) {
    const { expandAll, collapseAll } = useContext(IconContext);
    const { expandAll: expandLang, collapseAll: collapseLang } = useContext(LanguageContext);

    return (
        <div className="rct-actions">
            <Button
                className="rct-action rct-action-expand-all"
                title={expandLang}
                onClick={onExpandAll}
            >
                {expandAll}
            </Button>
            <Button
                className="rct-action rct-action-collapse-all"
                title={collapseLang}
                onClick={onCollapseAll}
            >
                {collapseAll}
            </Button>
        </div>
    );
}

GlobalActions.propTypes = propTypes;

export default GlobalActions;
