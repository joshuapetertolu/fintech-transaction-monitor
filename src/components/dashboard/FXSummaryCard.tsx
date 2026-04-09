import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@theme/index';
import { Typography } from '@components/common/Typography';
import { FilterPill } from '@/components/dashboard/FilterPill';

const FILTERS = ["FX bought", "FX sold", "Others"];

export const FXSummaryCard = () => {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [isVisible, setIsVisible] = useState(true);

  const getDynamicPill = () => {
    if (activeFilter === "Others") {
      return (
        <View style={styles.categoryPill}>
          <Typography variant="body" color="#FFFFFF" weight="medium">
            Medicals
          </Typography>
          <Feather name="chevron-down" size={16} color="#FFFFFF" />
        </View>
      );
    }
    return (
      <View style={styles.currencyPill}>
        <Typography style={styles.flag}>🇺🇸</Typography>
        <Typography variant="body" color="#FFFFFF" weight="medium">
          USD
        </Typography>
        <Feather name="chevron-down" size={16} color="#FFFFFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((filter) => (
            <FilterPill 
              key={filter}
              label={filter}
              isActive={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.labelGroup}>
          <Typography variant="body" color={COLORS.textSecondary} style={styles.label}>
            Total FX units
          </Typography>
          <TouchableOpacity 
            onPress={() => setIsVisible(!isVisible)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons 
              name={isVisible ? "eye" : "eye-off"} 
              size={20} 
              color="#1A1A1A" 
            />
          </TouchableOpacity>
        </View>

        {getDynamicPill()}
      </View>

      <View style={styles.balanceContainer}>
        {isVisible ? (
          <View style={styles.visibleBalance}>
            <View style={styles.symbolBadge}>
              <Typography variant="body" weight="bold">
                $
              </Typography>
            </View>
            <Typography variant="h1" weight="bold" style={styles.balanceText}>
              67,048<Typography variant="h3" weight="bold">.00</Typography>
            </Typography>
          </View>
        ) : (
          <View style={styles.hiddenBalance}>
            <View style={styles.symbolBadge}>
              <Typography variant="body" weight="bold">
                $
              </Typography>
            </View>
            <View style={styles.dotsRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    backgroundColor: COLORS.background,
  },
  filterWrapper: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: 4,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  flag: {
    fontSize: 16,
  },
  balanceContainer: {
    paddingHorizontal: SPACING.lg,
  },
  visibleBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hiddenBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  symbolBadge: {
    backgroundColor: '#EDEDED',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 32,
    letterSpacing: -1,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E1E1E',
  },
});
