import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { COLORS, SPACING } from '@theme/index';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}


export const Button = ({
  label,
  variant = 'primary',
  isLoading = false,
  style,
  labelStyle,
  disabled,
  ...props
}: ButtonProps) => {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const containerStyle = [
    styles.base,
    styles[variant],
    disabled || isLoading ? styles.disabled : null,
    style,
  ];

  const textStyle = [
    styles.textBase,
    isOutline || isGhost ? { color: COLORS.primary } : { color: '#FFFFFF' },
    isSecondary ? { color: COLORS.text } : null,
    labelStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isOutline || isGhost ? COLORS.primary : '#FFFFFF'} size="small" />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
  },
  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },
});
