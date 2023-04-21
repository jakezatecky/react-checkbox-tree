import React, {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';
import PropTypes from 'prop-types';

const CheckboxTreeContext = createContext();

export function CheckboxTreeProvider({ children }) {
    const [treeModel, setTreeModel] = useState();

    const value = useMemo(() => ({ treeModel, setTreeModel }), [treeModel, setTreeModel]);
    return (
        <CheckboxTreeContext.Provider value={value}>
            {children}
        </CheckboxTreeContext.Provider>
    );
}

export const useCheckboxTree = () => {
    const value = useContext(CheckboxTreeContext);
    if (value === undefined) {
        throw new Error('useCheckboxTree must be used within a CheckboxTreeProvider');
    }
    return value;
};

CheckboxTreeProvider.propTypes = {
    children: PropTypes.node,
};
CheckboxTreeProvider.defaultProps = {
    children: null,
};
