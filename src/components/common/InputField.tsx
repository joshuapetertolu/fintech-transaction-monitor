import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  TextInputProps,
  ViewStyle
} from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Feather } from '@expo/vector-icons';
import { Typography } from '@/components/common/Typography';
import { COLORS, SPACING } from '@theme/index';

interface InputFieldProps<T extends FieldValues> extends TextInputProps {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const InputField = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  containerStyle,
  isPassword,
  secureTextEntry,
  ...props
}: InputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Typography variant="caption" weight="medium" style={styles.label}>{label}</Typography>}
      
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[
            styles.inputBox, 
            error ? styles.inputError : null
          ]}>
            <TextInput
              style={styles.input}
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={isPassword ? !showPassword : secureTextEntry}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              {...props}
            />
            
            {isPassword && (
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                style={styles.icon}
              >
                <Feather 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      
      {error && <Typography variant="error" style={styles.errorText}>{error}</Typography>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  label: {
    color: COLORS.text,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 52,
    paddingHorizontal: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    height: '100%',
  },
  icon: {
    padding: 4,
  },
  errorText: {
    marginLeft: 4,
  },
});
