import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import { GridColDef } from '@mui/x-data-grid';

const useGridStatePersist = (
  apiRef: React.MutableRefObject<GridApiPro>,
  columns: GridColDef[],
  prefix: string
) => {
  const stateItem = `${prefix}DataGridState`;
  const hasRestoredRef = useRef(false);

  const saveSnapshot = useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem(stateItem, JSON.stringify(currentState));
    }
  }, [apiRef, stateItem]);

  useLayoutEffect(() => {
    const handleBeforeUnload = () => {
      saveSnapshot();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  useEffect(() => {
    if (
      !hasRestoredRef.current &&
      columns != null &&
      apiRef?.current?.restoreState != null &&
      localStorage?.getItem(stateItem)
    ) {
      const state = JSON.parse(localStorage.getItem(stateItem));
      apiRef?.current?.restoreState({
        columns: state.columns,
        sorting: state.sorting
      });
      hasRestoredRef.current = true;
    }
  }, [apiRef, columns, stateItem]);
};

export default useGridStatePersist;
