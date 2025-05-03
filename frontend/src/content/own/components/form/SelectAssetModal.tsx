import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from '../../../../store';
import {
  getAssetChildren,
  resetAssetsHierarchy
} from '../../../../slices/asset';
import CustomDataGrid, { CustomDatagridColumn } from '../CustomDatagrid';
import {
  GridRenderCellParams,
  GridRow,
  GridEventListener
} from '@mui/x-data-grid';
import { DataGridProProps, useGridApiRef } from '@mui/x-data-grid-pro';
import { AssetRow, AssetMiniDTO } from '../../../../models/owns/asset';
import { GroupingCellWithLazyLoading } from '../../Assets/GroupingCellWithLazyLoading'; // Assuming this can be reused
import ReplayTwoToneIcon from '@mui/icons-material/ReplayTwoTone';
import { Pageable } from '../../../../models/owns/page';
import NoRowsMessageWrapper from '../NoRowsMessageWrapper';
import { boolean, number } from 'yup';

interface SelectAssetModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: AssetMiniDTO) => void;
  excludedAssetId?: number;
  locationId?: number;
}

const SelectAssetModal: React.FC<SelectAssetModalProps> = ({
  open,
  onClose,
  onSelect,
  excludedAssetId,
  locationId
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const { assetsHierarchy, loadingGet } = useSelector((state) => state.assets);
  const [pageable, setPageable] = useState<Pageable>({ page: 0, size: 1000 }); // Adjust size as needed
  const [deployedAssets, setDeployedAssets] = useState<
    { id: number; hierarchy: number[] }[]
  >([{ id: 0, hierarchy: [] }]);

  const handleReset = (callApi: boolean) => {
    dispatch(resetAssetsHierarchy(callApi));
    setDeployedAssets([{ id: 0, hierarchy: [] }]); // Reset deployed state as well
    if (callApi) {
      dispatch(getAssetChildren(0, [], pageable));
    }
  };

  useEffect(() => {
    if (open) {
      handleReset(true); // Fetch root assets when modal opens
    }
  }, [open, dispatch, pageable]); // Add pageable to dependencies if needed

  useEffect(() => {
    if (apiRef.current.getRow) {
      const handleRowExpansionChange: GridEventListener<
        'rowExpansionChange'
      > = async (node) => {
        const row = apiRef.current.getRow(node.id) as AssetRow | null;
        if (!node.childrenExpanded || !row || row.childrenFetched) {
          return;
        }
        apiRef.current.updateRows([
          {
            id: t('loading_assets', { name: row.name, id: node.id }),
            hierarchy: [...row.hierarchy, '']
          }
        ]);
        if (
          !deployedAssets.find((deployedAsset) => deployedAsset.id === row.id)
        ) {
          setDeployedAssets((prev) => [
            ...prev,
            { id: row.id, hierarchy: row.hierarchy }
          ]);
        }
        dispatch(getAssetChildren(row.id, row.hierarchy, pageable));
      };

      const handleCellKeyDown: GridEventListener<'cellKeyDown'> = (
        params,
        event
      ) => {
        const cellParams = apiRef.current.getCellParams(
          params.id,
          params.field
        );
        if (cellParams.colDef.type === 'treeDataGroup' && event.key === ' ') {
          event.stopPropagation();
          event.preventDefault();
          event.defaultMuiPrevented = true;
          apiRef.current.setRowChildrenExpansion(
            params.id,
            !params.rowNode.childrenExpanded
          );
        }
      };

      const unsubscribeExpansion = apiRef.current.subscribeEvent(
        'rowExpansionChange',
        handleRowExpansionChange
      );
      const unsubscribeKeyDown = apiRef.current.subscribeEvent(
        'cellKeyDown',
        handleCellKeyDown,
        { isFirst: true }
      );

      return () => {
        unsubscribeExpansion();
        unsubscribeKeyDown();
      };
    }
  }, [apiRef, dispatch, pageable, t, deployedAssets]); // Include deployedAssets

  const columns: CustomDatagridColumn[] = [
    {
      field: 'customId',
      headerName: t('id'),
      flex: 1
    },
    {
      field: 'name',
      headerName: t('name'),
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Box sx={{ fontWeight: 'bold' }}>{params.value}</Box>
      )
    },
    {
      field: 'location',
      headerName: t('location'),
      flex: 1,
      valueGetter: (params) => params.row.location?.name ?? ''
    }
  ];

  const groupingColDef: DataGridProProps['groupingColDef'] = {
    headerName: t('hierarchy'),
    renderCell: (params) => <GroupingCellWithLazyLoading {...params} />
  };

  const CustomRow = (props: React.ComponentProps<typeof GridRow>) => {
    const rowNode = apiRef.current.getRowNode(props.rowId);
    return (
      <GridRow
        {...props}
        style={
          (rowNode?.depth ?? 0) > 0
            ? {
                backgroundColor:
                  rowNode.depth % 2 === 0
                    ? theme.colors.primary.light
                    : theme.colors.primary.main,
                color: 'white'
              }
            : undefined
        }
      />
    );
  };

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    // Prevent selection of loading rows or excluded asset
    if (typeof params.id === 'string' && params.id.startsWith('loading_'))
      return;
    if (params.id === excludedAssetId) return;

    const selectedAsset: AssetMiniDTO = {
      id: params.row.id,
      name: params.row.name,
      customId: params.row.customId
    };
    onSelect(selectedAsset);
    onClose();
  };

  const filteredAssetsHierarchy = assetsHierarchy.filter(
    (asset) =>
      asset.id !== excludedAssetId &&
      (locationId ? asset.location?.id === locationId : true)
  );

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4">{t('select_asset')}</Typography>
        <IconButton
          onClick={() => handleReset(true)}
          color="primary"
          size="small"
        >
          <ReplayTwoToneIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 1, height: '60vh' }}>
        <Box sx={{ height: '100%', width: '100%' }}>
          <CustomDataGrid
            pro
            treeData
            apiRef={apiRef}
            columns={columns}
            rows={filteredAssetsHierarchy} // Use filtered rows
            loading={loadingGet}
            getRowId={(row) => row.id} // Ensure correct ID is used
            getRowHeight={() => 'auto'}
            getTreeDataPath={(row) => row.hierarchy.map(String)}
            groupingColDef={groupingColDef}
            disableColumnFilter
            disableSelectionOnClick
            components={{
              Row: CustomRow,
              NoRowsOverlay: () => (
                <NoRowsMessageWrapper
                  message={t('noRows.asset.message')}
                  action={t('noRows.asset.action')}
                />
              )
            }}
            onRowClick={handleRowClick}
            initialState={{
              columns: { columnVisibilityModel: {} }
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SelectAssetModal;
