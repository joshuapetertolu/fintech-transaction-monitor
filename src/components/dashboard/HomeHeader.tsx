import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@store/useAuthStore';
import { Typography } from '@components/common/Typography';
import { withSoftTouch } from '@hoc/withSoftTouch';
import { COLORS, SPACING } from '@theme/index';

const IconButton = withSoftTouch(({ icon, isAsset = false, showDot = false }: { icon: any, isAsset?: boolean, showDot?: boolean }) => (
  <View style={styles.iconButton}>
    {isAsset ? (
      <Image source={icon} style={styles.assetIcon} />
    ) : (
      <Feather name={icon} size={22} color={COLORS.text} />
    )}
    {showDot && <View style={styles.notificationDot} />}
  </View>
));

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning ⛅";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon ☀️";
  } else {
    return "Good evening ✨☁️";
  }
};

export const HomeHeader = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const greeting = getGreeting();

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8}>
        <Image 
          source={require('@assets/profile-pic.jpg')} 
          style={styles.avatar} 
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.greetingRow}>
          <Typography variant="caption" color={COLORS.textSecondary}>
            {greeting}
          </Typography>
        </View>
        
        <View style={styles.nameRow}>
          <Typography variant="h3" weight="bold">
            Emmanuel Israel
          </Typography>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Typography style={styles.adminText}>Admin</Typography>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <IconButton icon="search" />
        <IconButton 
          icon={require('@assets/notification.png')} 
          isAsset={true} 
          showDot={true} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  greetingRow: {
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#A5D6A7',
  },
  adminText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D32',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconButton: {
    width: 40,
    height: 40,    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  assetIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: COLORS.text,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
});
