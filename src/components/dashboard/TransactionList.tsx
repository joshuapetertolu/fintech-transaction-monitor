import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Animated,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "@/components/common/Typography";
import { RootStackParamList } from "@/navigation/types";
import { COLORS, SPACING } from "@/theme/index";
import {
  useTransactionStore,
  Transaction,
  TransactionStatus,
} from "@/store/transactionStore";
import { useTransactionStream } from "@/hooks/useTransactionStream";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ShimmerRow = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerValue]);

  const opacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.View style={[styles.shimmerIcon, { opacity }]} />
      <View style={styles.textContainer}>
        <Animated.View style={[styles.shimmerTitle, { opacity }]} />
        <Animated.View style={[styles.shimmerSubtitle, { opacity }]} />
      </View>
      <Animated.View style={[styles.shimmerAmount, { opacity }]} />
    </View>
  );
};

const EmptyStateView = React.memo(({ onReset }: { onReset: () => void }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="search-outline" size={48} color={COLORS.textSecondary} />
    <Typography weight="bold" style={{ marginTop: 12 }}>
      No Transactions Found
    </Typography>
    <TouchableOpacity style={styles.resetButton} onPress={onReset}>
      <Typography color={COLORS.surface} weight="bold">
        Reset Filters
      </Typography>
    </TouchableOpacity>
  </View>
));

const ErrorStateView = React.memo(({ onRetry }: { onRetry: () => void }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="cloud-offline-outline" size={48} color={COLORS.error} />
    <Typography weight="bold" style={{ marginTop: 12 }}>
      Network Error
    </Typography>
    <TouchableOpacity
      style={[styles.resetButton, { backgroundColor: COLORS.error }]}
      onPress={onRetry}
    >
      <Typography color={COLORS.surface} weight="bold">
        Try Again
      </Typography>
    </TouchableOpacity>
  </View>
));

const TransactionItem = React.memo(
  ({ item }: { item: Transaction }) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isIncoming = item.type === "incoming";
    const formattedAmount = isIncoming
      ? `$${item.amount.toFixed(2)}`
      : `-$${Math.abs(item.amount).toFixed(2)}`;
    const iconTintColor = isIncoming ? COLORS.success : COLORS.primary;

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("TransactionDetail", {
            id: item.id,
            transaction: item,
          })
        }
        style={({ pressed }) => [
          styles.itemContainer,
          pressed && styles.itemPressed,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            isIncoming
              ? styles.iconContainerIncoming
              : styles.iconContainerOutgoing,
          ]}
        >
          <Image
            source={
              isIncoming
                ? require("@assets/debit.png")
                : require("@assets/credit.png")
            }
            style={[styles.icon, { tintColor: iconTintColor }]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Typography weight="semibold" style={styles.titleText}>
            {item.title}
          </Typography>
          <Typography variant="caption" color={COLORS.textSecondary}>
            {item.date}
          </Typography>
        </View>
        <View style={styles.amountContainer}>
          <Typography
            weight="bold"
            style={isIncoming ? styles.amountIncoming : styles.amountOutgoing}
          >
            {formattedAmount}
          </Typography>
        </View>
      </Pressable>
    );
  },
  (prev, next) => prev.item.id === next.item.id && prev.item === next.item,
);

const ListTopCap = () => <View style={styles.listTopCap} />;
const ListBottomCap = () => <View style={styles.listBottomCap} />;

const SHIMMER_KEYS = ["s1", "s2", "s3", "s4", "s5"];
const ShimmerList = () => (
  <View style={{ marginTop: 8 }}>
    {SHIMMER_KEYS.map((k) => (
      <ShimmerRow key={k} />
    ))}
  </View>
);

interface TransactionListProps {
  ListHeaderComponent?: React.ReactElement;
}

export const TransactionList = ({
  ListHeaderComponent,
}: TransactionListProps) => {
  const {
    isLoading,
    error,
    transactions,
    fetchTransactions,
    fetchNextPage,
    hasMore,
    getFilteredTransactions,
    searchQuery: globalSearchQuery,
    setSearchQuery,
    activeStatus,
    setActiveStatus,
  } = useTransactionStore();

  useTransactionStream();

  const [localSearch, setLocalSearch] = useState(globalSearchQuery);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    fetchTransactions(true);
  }, []);

  useEffect(() => {
    setLocalSearch(globalSearchQuery);
  }, [globalSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 400); 
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchTransactions(true);
    setIsRefreshing(false);
  }, [fetchTransactions]);

  const filteredTransactions = getFilteredTransactions();

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setActiveStatus("all");
    fetchTransactions(true);
  }, [fetchTransactions, setSearchQuery, setActiveStatus]);

  const handleEndReached = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const openFilterModal = useCallback(() => setShowFilterModal(true), []);
  const closeFilterModal = useCallback(() => setShowFilterModal(false), []);

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => <TransactionItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const searchQueryRef = useRef(localSearch);
  const setSearchRef = useRef(setLocalSearch);
  const activeStatusRef = useRef(activeStatus);
  const openFilterRef = useRef(openFilterModal);

  searchQueryRef.current = localSearch;
  activeStatusRef.current = activeStatus;
  openFilterRef.current = openFilterModal;

  const ListFooterComponent = useMemo(
    () => (
      <View>
        <ListBottomCap />
        {hasMore && transactions.length > 0 && (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
      </View>
    ),
    [hasMore, transactions.length],
  );

  const ListEmptyComponent = useMemo(
    () =>
      isLoading ? <ShimmerList /> : <EmptyStateView onReset={handleReset} />,
    [isLoading, handleReset],
  );

  if (error && transactions.length === 0) {
    return <ErrorStateView onRetry={() => fetchTransactions(true)} />;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <SearchHeader
            ListHeaderComponent={ListHeaderComponent}
            searchQuery={localSearch}
            onChangeSearch={setLocalSearch}
            activeStatus={activeStatus}
            onOpenFilter={openFilterModal}
          />
        }
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={false}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50} 
        windowSize={10}
        scrollEventThrottle={16}
        overScrollMode="never"
        contentContainerStyle={styles.flatListContent}
      />

      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={closeFilterModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeFilterModal}>
          <View style={styles.modalContent}>
            <Typography variant="h3" weight="bold" style={{ marginBottom: 20 }}>
              Filter by Status
            </Typography>
            {(["all", "pending", "success", "failed"] as const).map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.filterOption}
                  onPress={() => {
                    setActiveStatus(status);
                    closeFilterModal();
                  }}
                >
                  <Typography
                    weight={activeStatus === status ? "bold" : "medium"}
                    color={
                      activeStatus === status ? COLORS.primary : COLORS.text
                    }
                    style={{ textTransform: "capitalize" }}
                  >
                    {status}
                  </Typography>
                  {activeStatus === status && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              ),
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

interface SearchHeaderProps {
  ListHeaderComponent?: React.ReactElement;
  searchQuery: string;
  onChangeSearch: (v: string) => void;
  activeStatus: TransactionStatus | "all";
  onOpenFilter: () => void;
}

const SearchHeader = React.memo(
  ({
    ListHeaderComponent,
    searchQuery,
    onChangeSearch,
    activeStatus,
    onOpenFilter,
  }: SearchHeaderProps) => (
    <View>
      {ListHeaderComponent}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textSecondary}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search transactions..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={onChangeSearch}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeStatus !== "all" && styles.filterButtonActive,
          ]}
          onPress={onOpenFilter}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color={activeStatus !== "all" ? COLORS.primary : COLORS.text}
          />
        </TouchableOpacity>
      </View>
      <ListTopCap />
    </View>
  ),
);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flatListContent: { paddingBottom: 40 },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: 16,
    marginTop: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontFamily: "Inter_400Regular",
  },
  filterButton: {
    marginLeft: 10,
    width: 48,
    height: 48,
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "rgba(249, 108, 19, 0.1)",
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    height: 74,
    backgroundColor: "#F1F1F1",
    marginHorizontal: SPACING.lg,
  },
  itemPressed: { backgroundColor: "rgba(0,0,0,0.03)" },
  listTopCap: {
    height: 16,
    backgroundColor: "#F1F1F1",
    marginHorizontal: SPACING.lg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 4,
  },
  listBottomCap: {
    height: 16,
    backgroundColor: "#F1F1F1",
    marginHorizontal: SPACING.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainerIncoming: { backgroundColor: "rgba(52, 199, 89, 0.1)" },
  iconContainerOutgoing: { backgroundColor: "rgba(249, 108, 19, 0.1)" },
  icon: { width: 18, height: 18 },
  textContainer: { flex: 1 },
  titleText: { fontSize: 14, color: COLORS.text, marginBottom: 2 },
  amountContainer: { alignItems: "flex-end" },
  amountIncoming: { color: COLORS.success },
  amountOutgoing: { color: COLORS.text },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    marginHorizontal: SPACING.lg,
    borderRadius: 32,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  shimmerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  shimmerTitle: {
    width: "50%",
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E0E0E0",
    marginBottom: 6,
  },
  shimmerSubtitle: {
    width: "30%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
  },
  shimmerAmount: {
    width: 50,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
});
