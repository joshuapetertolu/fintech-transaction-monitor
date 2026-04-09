import React from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  Pressable, 
  Animated,
  TouchableOpacity
} from 'react-native';
import { Typography } from '@/components/common/Typography';
import { COLORS, SPACING } from '@/theme/index';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const CustomAlert = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}: CustomAlertProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        
        <View style={styles.alertCard}>
          <Typography variant="h3" weight="bold" style={styles.title}>
            {title}
          </Typography>
          
          <Typography variant="body" color={COLORS.textSecondary} style={styles.message}>
            {message}
          </Typography>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Typography weight="semibold" color={COLORS.textSecondary}>
                {cancelText}
              </Typography>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.confirmButton, 
                isDestructive && styles.destructiveButton
              ]} 
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Typography weight="bold" color={COLORS.surface}>
                {confirmText}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  alertCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    flex: 1.5,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },
  destructiveButton: {
    backgroundColor: COLORS.error,
  },
});
