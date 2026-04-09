import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Switch, 
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@store/useAuthStore';
import { Typography } from '@/components/common/Typography';
import { COLORS, SPACING } from '@/theme/index';
import { CustomAlert } from '@/components/common/CustomAlert';

interface SettingRowProps {
  label: string;
  value?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
}

const SettingRow = ({ 
  label, 
  value, 
  icon, 
  onPress, 
  showChevron = true, 
  isDestructive = false,
  rightElement
}: SettingRowProps) => (
  <TouchableOpacity 
    style={styles.row} 
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.rowIconContainer}>
      <Ionicons name={icon} size={22} color={isDestructive ? COLORS.error : COLORS.text} />
    </View>
    <View style={styles.rowTextContainer}>
      <Typography weight="medium" color={isDestructive ? COLORS.error : COLORS.text}>
        {label}
      </Typography>
    </View>
    {value && (
      <Typography variant="body" color={COLORS.textSecondary} style={{ marginRight: 8 }}>
        {value}
      </Typography>
    )}
    {rightElement}
    {showChevron && !rightElement && (
      <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
    )}
  </TouchableOpacity>
);

const SettingGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.groupContainer}>
    <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.groupTitle}>
      {title.toUpperCase()}
    </Typography>
    <View style={styles.card}>
      {children}
    </View>
  </View>
);

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const memberSince = "Joined Oct 2023";
  const lastActiveIP = "192.168.***.***";

  const handleLogoutConfirm = async () => {
    setShowLogoutAlert(false);
    await logout();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('@assets/profile-pic.jpg')} 
              style={styles.avatar}
            />
          </View>
          <View style={styles.headerInfo}>
            <Typography variant="h2" weight="bold">{user?.email?.split('@')[0] || 'User Name'}</Typography>
            <View style={styles.roleBadge}>
              <Typography variant="caption" weight="bold" color={COLORS.primary} style={styles.roleText}>
                {user?.role?.toUpperCase() || 'ANALYST'}
              </Typography>
            </View>
            <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: 4 }}>
              {memberSince}
            </Typography>
          </View>
        </View>

        <SettingGroup title="Account">
          <SettingRow 
            label="Personal Info" 
            icon="person-outline" 
            onPress={() => {}} 
          />
          <SettingRow 
            label="Notification Settings" 
            icon="notifications-outline" 
            onPress={() => {}} 
          />
        </SettingGroup>

        <SettingGroup title="Security">
          <SettingRow 
            label="Face ID / Touch ID" 
            icon="finger-print-outline" 
            showChevron={false}
            rightElement={
              <Switch 
                value={isBiometricEnabled}
                onValueChange={setIsBiometricEnabled}
                trackColor={{ false: '#E0E0E0', true: COLORS.primary + '80' }}
                thumbColor={isBiometricEnabled ? COLORS.primary : '#F4F3F4'}
              />
            }
          />
          <SettingRow 
            label="Privacy Policy" 
            icon="shield-checkmark-outline" 
            onPress={() => {}} 
          />
          <SettingRow 
            label="Security Audit" 
            icon="eye-outline" 
            value={lastActiveIP}
            showChevron={false}
          />
        </SettingGroup>

        <SettingGroup title="Support">
          <SettingRow 
            label="Help Center" 
            icon="help-circle-outline" 
            onPress={() => {}} 
          />
          <SettingRow 
            label="About SohCahToa" 
            icon="information-circle-outline" 
            onPress={() => {}} 
          />
        </SettingGroup>

        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => setShowLogoutAlert(true)}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={{ marginRight: 8 }} />
            <Typography weight="bold" color={COLORS.error}>Log Out</Typography>
          </TouchableOpacity>
          <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: 12 }}>
            Version 1.0.4 (Prod_Stable)
          </Typography>
        </View>

      </ScrollView>

      <CustomAlert 
        visible={showLogoutAlert}
        title="Confirm Logout"
        message="Are you sure you want to log out of SohCahToa? Your session will be terminated and storage wiped."
        confirmText="Logout"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutAlert(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    marginLeft: 20,
    flex: 1,
  },
  roleBadge: {
    backgroundColor: 'rgba(249, 108, 19, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  roleText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  groupContainer: {
    marginBottom: 24,
    paddingHorizontal: SPACING.lg,
  },
  groupTitle: {
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowTextContainer: {
    flex: 1,
  },
  logoutContainer: {
    marginTop: 16,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
    backgroundColor: 'transparent',
  },
});
