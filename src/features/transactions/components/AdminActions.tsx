import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Switch, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction, useTransactionStore } from '@store/transactionStore';
import { COLORS } from '@theme/index';
import { Typography } from '@components/common/Typography';
import { toast } from '@utils/toast';

const SectionHeader = ({ icon, title }: { icon: any; title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Ionicons name={icon} size={16} color={COLORS.textSecondary} style={styles.sectionIcon} />
    <Typography variant="caption" weight="semibold" color={COLORS.textSecondary} style={styles.sectionTitle}>
      {title}
    </Typography>
  </View>
);

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.card}>
    {children}
  </View>
);

interface AdminActionsProps {
  transaction: Transaction;
  isAdmin: boolean;
}

export const AdminActions = ({ transaction, isAdmin }: AdminActionsProps) => {
  const { flagTransaction, updateTransactionNote } = useTransactionStore();
  
  const [internalNotes, setInternalNotes] = useState(transaction.internalNotes || '');
  const [isUpdatingFlag, setIsUpdatingFlag] = useState(false);
  const [isSyncingNotes, setIsSyncingNotes] = useState(false);

  const handleToggleFlag = useCallback(async () => {
    if (isUpdatingFlag) return;
    setIsUpdatingFlag(true);
    try {
      await flagTransaction(transaction.id);
      toast.success('Transaction flag updated successfully.');
    } catch (error) {
      toast.error('Flag update failed. Please try again.');
    } finally {
      setIsUpdatingFlag(false);
    }
  }, [transaction.id, flagTransaction, isUpdatingFlag]);

  const handleSyncNotes = useCallback(async () => {
    if (isSyncingNotes) return;
    setIsSyncingNotes(true);
    try {
      await updateTransactionNote(transaction.id, internalNotes);
      toast.success('Internal notes synchronized with server.');
    } catch (error) {
      toast.error('Note sync failed. Please try again.');
    } finally {
      setIsSyncingNotes(false);
    }
  }, [transaction.id, internalNotes, isSyncingNotes, updateTransactionNote]);

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <SectionHeader icon="settings-outline" title="ADMINISTRATION" />
      <InfoCard>
        <View style={styles.actionRow}>
          <View style={styles.actionTextContainer}>
            <Typography variant="body" weight="semibold">Flag for Investigation</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Mark this transaction as suspicious</Typography>
          </View>
          <Switch 
            value={transaction.isFlagged}
            onValueChange={handleToggleFlag}
            disabled={isUpdatingFlag}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.surface}
          />
        </View>

        <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={{ marginTop: 20, marginBottom: 8 }}>
          INTERNAL NOTES
        </Typography>
        <TextInput
          style={styles.textInput}
          placeholder="Add private analyst notes here..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          value={internalNotes}
          onChangeText={setInternalNotes}
        />
        
        <Pressable 
          style={({ pressed }) => [
            styles.primaryButton,
            (pressed || isSyncingNotes) && styles.buttonPressed
          ]}
          onPress={handleSyncNotes}
          disabled={isSyncingNotes}
        >
          <Typography color={COLORS.surface} weight="bold">
            {isSyncingNotes ? 'Syncing...' : 'Sync Audit Notes'}
          </Typography>
        </Pressable>
      </InfoCard>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
