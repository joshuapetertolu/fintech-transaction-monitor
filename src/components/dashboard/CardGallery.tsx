import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Typography } from '@/components/common/Typography';
import { SPACING } from '@/theme/index';
import { BankCard } from '@/components/dashboard/BankCard';
import { AddCardButton } from '@/components/dashboard/AddCardButton';

export const CardGallery = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="body" weight="medium" style={styles.title}>
          Cards
        </Typography>
      </View>
      
      <View style={styles.cardsRow}>
        <BankCard />
        <AddCardButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#808080',
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
});
