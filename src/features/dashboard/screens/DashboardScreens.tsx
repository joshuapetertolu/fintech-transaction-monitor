import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@theme/index';
import { Typography } from '@components/common/Typography';
import { HomeHeader } from '@components/dashboard/HomeHeader';
import { FXSummaryCard } from '@components/dashboard/FXSummaryCard';
import { ActionGrid } from '@components/dashboard/ActionGrid';
import { CardGallery } from '@components/dashboard/CardGallery';
import { RecentTransactions } from '@components/dashboard/RecentTransactions';
import { TransactionList } from '@components/dashboard/TransactionList';

import { ProfileScreen } from '@features/profile/screens/ProfileScreen';

const ScreenPlaceholder = ({ name }: { name: string }) => (
  <View style={styles.container}>
    <Typography variant="h2">{name} Screen</Typography>
    <Typography variant="caption">SohCahToa Fintech Monitor</Typography>
  </View>
);

export const HomeScreen = () => (
  <SafeAreaView style={styles.screen}>
    <TransactionList 
      ListHeaderComponent={
        <>
          <HomeHeader />
          <FXSummaryCard />
          <ActionGrid />
          <CardGallery />
          <RecentTransactions />
        </>
      }
    />
  </SafeAreaView>
);

export const CalculatorScreen = () => <ScreenPlaceholder name="Calculator" />;
export const TransferScreen = () => <ScreenPlaceholder name="Transfer" />;
export const CardsScreen = () => <ScreenPlaceholder name="Cards" />;
export { ProfileScreen };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
