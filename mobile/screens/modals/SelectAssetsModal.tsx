import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator // Added
} from 'react-native';
import { View } from '../../components/Themed';
import { RootStackScreenProps } from '../../types';
import { useTranslation } from 'react-i18next';
import * as React from 'react';
import { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { useDispatch, useSelector } from '../../store';
import { AssetMiniDTO } from '../../models/asset';
// TODO: Replace getAssetsMini with a new action like getAssetsHierarchy if needed
import { getAssetsMini } from '../../slices/asset';
import {
  Checkbox,
  Divider,
  Searchbar,
  Text,
  useTheme,
  SegmentedButtons, // Added
  IconButton // Added
} from 'react-native-paper';

// TODO: Define this interface based on the actual API response for hierarchy
// Assuming it includes fields necessary for display and selection (like AssetMiniDTO) plus hierarchy info
interface AssetHierarchyNode extends AssetMiniDTO {
  hasChildren: boolean;
  // Add any other fields returned by the hierarchy endpoint if different from AssetMiniDTO
}

export default function SelectAssetsModal({
  navigation,
  route
}: RootStackScreenProps<'SelectAssets'>) {
  const { onChange, selected, multiple, locationId } = route.params;
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const { assetsMini, loadingGet } = useSelector((state) => state.assets);

  const assetsHierarchy: AssetHierarchyNode[] = useMemo(() => {
    return assetsMini.map((asset) => ({
      ...asset,
      hasChildren: assetsMini.some((child) => child.parentId === asset.id)
    }));
  }, [assetsMini]);
  const loadingHierarchy = loadingGet; // Use loadingGet as placeholder
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [view, setView] = useState<'list' | 'hierarchy'>('list');
  const [currentHierarchyLevel, setCurrentHierarchyLevel] = useState<
    AssetHierarchyNode[]
  >([]);
  const [currentHierarchyParent, setCurrentHierarchyParent] =
    useState<AssetHierarchyNode | null>(null);
  const findAssetById = (
    id: number
  ): AssetHierarchyNode | AssetMiniDTO | undefined => {
    // Search in both lists until hierarchy data source is finalized
    return (
      assetsHierarchy.find((a) => a.id === id) ||
      assetsMini.find((a) => a.id === id)
    );
  };

  // Initialize selected IDs from route params
  useEffect(() => {
    if (!selectedIds.length && selected) {
      setSelectedIds(selected);
    }
  }, [selected]);

  useEffect(() => {
    dispatch(getAssetsMini(locationId));
  }, [locationId, dispatch]);

  // Update header button for multiple selection
  useEffect(() => {
    if (multiple) {
      const currentlySelectedAssets = selectedIds
        .map((id) => findAssetById(id))
        .filter((asset): asset is AssetMiniDTO => !!asset); // Ensure we pass AssetMiniDTO or compatible type

      navigation.setOptions({
        headerRight: () => (
          <Pressable
            disabled={!currentlySelectedAssets.length}
            onPress={() => {
              onChange(currentlySelectedAssets);
              navigation.goBack();
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.primary, marginRight: 10 }}
            >
              {t('add')} ({currentlySelectedAssets.length})
            </Text>
          </Pressable>
        )
      });
    }
  }, [
    selectedIds,
    multiple,
    navigation,
    onChange,
    assetsHierarchy,
    assetsMini
  ]);

  // Update hierarchy view when hierarchy data or parent changes
  useEffect(() => {
    if (view === 'hierarchy') {
      const children = assetsHierarchy.filter(
        (asset) => asset.parentId === (currentHierarchyParent?.id ?? null)
      );
      setCurrentHierarchyLevel(children);
    }
  }, [view, assetsHierarchy, currentHierarchyParent]);

  // --- Event Handlers ---

  const onSelect = (ids: number[]) => {
    const newSelectedIds = Array.from(new Set([...selectedIds, ...ids]));
    setSelectedIds(newSelectedIds);
    if (!multiple) {
      const selectedAsset = findAssetById(ids[0]);
      if (selectedAsset) {
        onChange([selectedAsset]); // Pass the found asset
        navigation.goBack();
      }
    }
  };

  const onUnSelect = (ids: number[]) => {
    const newSelectedIds = selectedIds.filter((id) => !ids.includes(id));
    setSelectedIds(newSelectedIds);
  };

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onUnSelect([id]);
    } else {
      onSelect([id]);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // If user starts searching, switch back to list view
    if (query) {
      setView('list');
    }
  };

  const handleViewChange = (newView: 'list' | 'hierarchy') => {
    setView(newView);
    // Clear search when switching to hierarchy view
    if (newView === 'hierarchy') {
      setSearchQuery('');
      // Reset to top level when switching to hierarchy view
      setCurrentHierarchyParent(null);
    } else {
      // Ensure list data is loaded when switching to list view
      if (!assetsMini.length) {
        dispatch(getAssetsMini(locationId));
      }
    }
  };

  const navigateHierarchyDown = (asset: AssetHierarchyNode) => {
    setCurrentHierarchyParent(asset);
  };

  const navigateHierarchyUp = () => {
    if (!currentHierarchyParent) return;
    const grandparentId = currentHierarchyParent.parentId;
    const grandparent = grandparentId
      ? assetsHierarchy.find((a) => a.id === grandparentId)
      : null;
    setCurrentHierarchyParent(grandparent); // Sets to null if grandparentId is null (top level)
  };

  // --- Rendering ---

  const renderListItem = (
    asset: AssetMiniDTO | AssetHierarchyNode,
    isHierarchyView = false
  ) => (
    <TouchableOpacity
      onPress={() => {
        // In hierarchy view, clicking the item selects it, unless it has children, then it navigates
        if (isHierarchyView && (asset as AssetHierarchyNode).hasChildren) {
          // Allow selection even if it has children
          toggle(asset.id);
        } else {
          toggle(asset.id);
        }
      }}
      key={asset.id}
      style={styles.itemContainer}
    >
      <View style={styles.itemContent}>
        {multiple && (
          <Checkbox
            status={selectedIds.includes(asset.id) ? 'checked' : 'unchecked'}
            onPress={() => toggle(asset.id)}
          />
        )}
        <Text style={styles.itemText} variant={'titleMedium'}>
          {asset.name}
        </Text>
      </View>
      {isHierarchyView && (asset as AssetHierarchyNode).hasChildren && (
        <IconButton
          icon="chevron-right"
          size={24}
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the main TouchableOpacity onPress
            navigateHierarchyDown(asset as AssetHierarchyNode);
          }}
        />
      )}
    </TouchableOpacity>
  );

  const filteredListAssets = useMemo(() => {
    return assetsMini.filter((mini) =>
      mini.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [assetsMini, searchQuery]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        placeholder={t('search')}
        onChangeText={handleSearchChange}
        value={searchQuery}
        style={{ backgroundColor: theme.colors.background, margin: 5 }}
      />
      <SegmentedButtons
        value={view}
        onValueChange={(value) =>
          handleViewChange(value as 'list' | 'hierarchy')
        }
        buttons={[
          { value: 'list', label: t('list') },
          { value: 'hierarchy', label: t('hierarchy') }
        ]}
        style={styles.segmentedButtons}
      />

      {view === 'hierarchy' && currentHierarchyParent && (
        <TouchableOpacity
          onPress={navigateHierarchyUp}
          style={styles.backButton}
        >
          <IconButton icon="arrow-left" size={20} />
          <Text variant="titleMedium">
            {t('back_to')}{' '}
            {currentHierarchyParent.parentId
              ? assetsHierarchy.find(
                  (a) => a.id === currentHierarchyParent.parentId
                )?.name
              : t('top_level')}
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={view === 'list' ? loadingGet : loadingHierarchy}
            onRefresh={() => {
              if (view === 'list') {
                dispatch(getAssetsMini(locationId));
              } else {
                // TODO: Dispatch refresh for hierarchy data
                // dispatch(getAssetsHierarchy(locationId)); // Example
                dispatch(getAssetsMini(locationId)); // Placeholder refresh
                setCurrentHierarchyParent(null); // Reset hierarchy view on refresh
              }
            }}
          />
        }
        style={styles.scrollView}
      >
        {view === 'list' &&
          (loadingGet && !filteredListAssets.length ? (
            <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
          ) : (
            filteredListAssets.map((asset) => renderListItem(asset))
          ))}

        {view === 'hierarchy' &&
          (loadingHierarchy && !currentHierarchyLevel.length ? (
            <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
          ) : (
            currentHierarchyLevel.map((asset) => renderListItem(asset, true))
          ))}

        {view === 'list' &&
          !loadingGet &&
          !filteredListAssets.length &&
          !!searchQuery && (
            <Text style={styles.noResultsText}>{t('no_results_found')}</Text>
          )}
        {view === 'list' &&
          !loadingGet &&
          !filteredListAssets.length &&
          !searchQuery && (
            <Text style={styles.noResultsText}>{t('no_assets_available')}</Text>
          )}
        {view === 'hierarchy' &&
          !loadingHierarchy &&
          !currentHierarchyLevel.length && (
            <Text style={styles.noResultsText}>{t('no_sub_assets')}</Text>
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  segmentedButtons: {
    marginHorizontal: 10,
    marginBottom: 10
  },
  scrollView: {
    flex: 1
  },
  itemContainer: {
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 5,
    paddingVertical: 10, // Reduced vertical padding
    paddingHorizontal: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1 // Allow text to shrink
  },
  itemText: {
    marginLeft: 10, // Add margin if checkbox is present
    flexShrink: 1 // Allow text to shrink
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5
    // Add background or border if needed
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'grey'
  }
});
