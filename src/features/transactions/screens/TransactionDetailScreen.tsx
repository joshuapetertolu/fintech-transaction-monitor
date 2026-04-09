import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  AppState,
  AppStateStatus,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as ScreenCapture from "expo-screen-capture";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@store/useAuthStore";
import {
  useTransactionStore,
  Transaction,
} from "@store/transactionStore";
import {
  formatCurrency,
  maskIpAddress,
  getTransactionStatusConfig,
} from "@utils/formatters";
import { COLORS } from "@theme/index";
import { Typography } from "@components/common/Typography";
import { AdminActions } from "../components/AdminActions";

const SectionHeader = ({ icon, title }: { icon: any; title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Ionicons
      name={icon}
      size={16}
      color={COLORS.textSecondary}
      style={styles.sectionIcon}
    />
    <Typography
      variant="caption"
      weight="semibold"
      color={COLORS.textSecondary}
      style={styles.sectionTitle}
    >
      {title}
    </Typography>
  </View>
);

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.card}>{children}</View>
);

const DetailRow = ({
  label,
  value,
  isLast = false,
  isMasked = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  isMasked?: boolean;
}) => (
  <View style={[styles.detailRow, isLast && { borderBottomWidth: 0 }]}>
    <Typography variant="caption" color={COLORS.textSecondary}>
      {label}
    </Typography>
    <Typography
      variant="body"
      weight="medium"
      style={[isMasked && styles.maskedValue]}
    >
      {value}
    </Typography>
  </View>
);

export const TransactionDetailScreen = ({ route }: any) => {
  const { id } = route?.params || {};
  const { user } = useAuthStore();
  const { transactions, flagTransaction } = useTransactionStore();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [appState, setAppState] = React.useState<AppStateStatus>(
    AppState.currentState,
  );

  React.useEffect(() => {
    if (Platform.OS === "android") {
      ScreenCapture.preventScreenCaptureAsync();
    }

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
      if (Platform.OS === "android") {
        ScreenCapture.allowScreenCaptureAsync();
      }
    };
  }, []);

  const isObscured =
    Platform.OS === "ios" &&
    (appState === "inactive" || appState === "background");

  const transaction = useMemo(
    () =>
      transactions.find((tx: Transaction) => tx.id === id) ||
      (route?.params?.transaction as Transaction),
    [transactions, id, route?.params?.transaction],
  );

  const isAdmin = user?.role === "admin";

  if (!transaction) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={COLORS.textSecondary}
        />
        <Typography color={COLORS.textSecondary} style={{ marginTop: 12 }}>
          Detailed transaction data unavailable.
        </Typography>
      </View>
    );
  }

  const mockDeviceInfo = "iPhone 15, iOS 17.4";
  const mockIpAddress = "192.168.1.105";
  const timestamp = transaction.date || new Date().toLocaleString();
  const statusConfig = getTransactionStatusConfig(transaction.status);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Typography variant="body" weight="semibold" style={styles.headerTitle}>
          Details
        </Typography>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerZone}>
          <Typography variant="h2" weight="bold" style={styles.amount}>
            {formatCurrency(transaction.amount)}
          </Typography>

          <View style={styles.minimalistStatusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusConfig.color },
              ]}
            />
            <Typography
              variant="caption"
              weight="semibold"
              color={statusConfig.color}
            >
              {statusConfig.label}
            </Typography>
            {transaction.isFlagged && (
              <>
                <Typography
                  variant="caption"
                  color={COLORS.textSecondary}
                  style={{ marginHorizontal: 6 }}
                >
                  •
                </Typography>
                <Typography
                  variant="caption"
                  weight="semibold"
                  color={COLORS.primary}
                >
                  Flagged
                </Typography>
              </>
            )}
          </View>

          <Typography
            variant="caption"
            color={COLORS.textSecondary}
            style={{ marginTop: 4 }}
          >
            {timestamp}
          </Typography>
        </View>

        <SectionHeader
          icon="information-circle-outline"
          title="TRANSACTION DETAILS"
        />
        <InfoCard>
          <DetailRow label="Reference ID" value={transaction.id} />
          <DetailRow
            label="Merchant"
            value={transaction.merchant || transaction.title || "Unknown"}
            isLast={true}
          />
        </InfoCard>

        <SectionHeader icon="shield-checkmark-outline" title="SECURITY AUDIT" />
        <InfoCard>
          <DetailRow
            label="Device Info"
            value={transaction.deviceInfo || mockDeviceInfo}
          />
          <DetailRow
            label="IP Address"
            value={
              isAdmin
                ? transaction.ipAddress || mockIpAddress
                : maskIpAddress(transaction.ipAddress || mockIpAddress)
            }
            isMasked={!isAdmin}
            isLast={true}
          />
        </InfoCard>

        <AdminActions transaction={transaction} isAdmin={isAdmin} />
      </ScrollView>

      {isObscured && (
        <View style={styles.obscureOverlay}>
          <Ionicons name="shield-checkmark" size={64} color={COLORS.primary} />
          <Typography variant="h2" style={{ marginTop: 16 }}>
            Secure Screen
          </Typography>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  obscureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.03)",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    letterSpacing: -0.4,
  },
  headerRightPlaceholder: {
    width: 44,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  headerZone: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  amount: {
    fontSize: 32,
    letterSpacing: -0.5,
  },
  minimalistStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  maskedValue: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    color: COLORS.text,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
