import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SPACING, COLORS } from '@/theme/index';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';

const ACTIONS = [
  {
    id: 'buy',
    label: 'Buy FX',
    icon: require('@assets/wallet-minus.png'),
  },
  {
    id: 'sell',
    label: 'Sell FX',
    icon: require('@assets/wallet-add.png'),
  },
  {
    id: 'receive',
    label: 'Receive\nmoney',
    icon: require('@assets/receive-money.png'),
  },
];

export const ActionGrid = () => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <QuickActionCard
            key={action.id}
            label={action.label}
            icon={action.icon}
          />
        ))}
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: COLORS.background,
  },
  grid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 20,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
});
