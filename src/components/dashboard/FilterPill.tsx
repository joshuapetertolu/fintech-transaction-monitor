import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Typography } from '@components/common/Typography';
import { COLORS } from '@theme/index';
import { withSoftTouch } from '@hoc/withSoftTouch';

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const PillBase = ({ label, isActive, onPress }: FilterPillProps) => {
  return (
    <Pressable 
      onPress={onPress}
      style={[
        styles.pill, 
        isActive ? styles.activePill : styles.inactivePill
      ]}
    >
      <Typography 
        variant="caption" 
        weight={isActive ? "semibold" : "medium"}
        color={isActive ? COLORS.primary : COLORS.textSecondary}
      >
        {label}
      </Typography>
    </Pressable>
  );
};

export const FilterPill = withSoftTouch(PillBase, 0.95);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  activePill: {
    backgroundColor: '#FFF4ED',
    borderColor: '#FFD7C2',
  },
  inactivePill: {
    backgroundColor: 'transparent',
    borderColor: '#F0F0F0',
  },
});
