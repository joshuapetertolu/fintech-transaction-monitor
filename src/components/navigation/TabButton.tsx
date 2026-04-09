import React from 'react';
import { 
  View, 
  Image, 
  Text, 
  StyleSheet, 
  ImageSourcePropType,
  ViewStyle
} from 'react-native';
import { COLORS } from '@theme/index';
import { withSoftTouch } from '@hoc/withSoftTouch';

interface TabButtonProps {
  label?: string;
  icon: ImageSourcePropType;
  isFocused: boolean;
  onPress?: (e: any) => void;
  isCenter?: boolean;
  showDot?: boolean;
  isProfile?: boolean;
  style?: ViewStyle;
}

const TabButtonBase = ({
  label,
  icon,
  isFocused,
  isCenter = false,
  showDot = false,
  isProfile = false,
}: TabButtonProps) => {
  if (isCenter) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.centerButton}>
          <Image source={icon} style={styles.centerIcon} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabItem}>
      <View style={styles.iconWrapper}>
        {isProfile ? (
          <Image source={icon} style={styles.profileAvatar} />
        ) : (
          <Image 
            source={icon} 
            style={[styles.tabIcon, { tintColor: isFocused ? COLORS.primary : COLORS.textSecondary }]} 
          />
        )}
        {showDot && <View style={styles.notificationDot} />}
      </View>
      {label && (
        <Text style={[
          styles.tabLabel, 
          { 
            color: isFocused ? COLORS.primary : COLORS.textSecondary,
            fontWeight: isFocused ? 'bold' : '500'
          }
        ]}>
          {label}
        </Text>
      )}
    </View>
  );
};

export const TabButton = withSoftTouch(TabButtonBase, 0.92);

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    height: '100%',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginBottom: 4,
    position: 'relative',
  },
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  profileAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabLabel: {
    fontSize: 11,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF4ED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centerIcon: {
    width: 22,
    height: 22,
    tintColor: COLORS.primary,
    resizeMode: 'contain',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
});
