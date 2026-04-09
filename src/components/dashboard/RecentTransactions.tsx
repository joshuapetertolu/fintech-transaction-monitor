import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Typography } from '@components/common/Typography';
import { COLORS, SPACING } from '@theme/index';
import { FilterPill } from '@/components/dashboard/FilterPill';

const FILTER_OPTIONS = ['All', 'FX', 'Card', 'PTA', 'BTA', 'Medicals'];

export const RecentTransactions = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Typography variant="body" weight="medium" style={styles.title}>
          Recent transactions
        </Typography>
        
        <Pressable style={styles.seeAllButton}>
          <Typography variant="caption" weight="medium" style={styles.seeAllText}>
            See all
          </Typography>
        </Pressable>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTER_OPTIONS.map((option) => (
          <FilterPill 
            key={option}
            label={option}
            isActive={activeFilter === option}
            onPress={() => setActiveFilter(option)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    color: '#2C2C2C',
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      }
    })
  },
  seeAllText: {
    color: '#2C2C2C',
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingRight: SPACING.lg + 20,
  },
});
