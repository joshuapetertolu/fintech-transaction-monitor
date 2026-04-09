import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Typography } from '@components/common/Typography';
import { COLORS } from '@theme/index';
import { withSoftTouch } from '@hoc/withSoftTouch';

interface QuickActionCardProps {
  label: string;
  icon: any;
  showDot?: boolean;
}

const CardBase = ({ label, icon }: QuickActionCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.labelContainer}>
        <Typography variant="body" weight="bold" color={COLORS.text} style={styles.labelText}>
          {label}
        </Typography>
      </View>
    </View>
  );
};

export const QuickActionCard = withSoftTouch(CardBase, 0.96);

const styles = StyleSheet.create({
  card: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  iconContainer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: COLORS.text,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 14,
  },
});
