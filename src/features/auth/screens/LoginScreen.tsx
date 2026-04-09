import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@store/useAuthStore";
import { COLORS, SPACING } from "@theme/index";
import { Typography } from "@components/common/Typography";
import { Button } from "@components/common/Button";
import { InputField } from "@components/common/InputField";
import { withLoading } from "@hoc/withLoading";
import { CustomAlert } from "@components/common/CustomAlert";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginScreenBase = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { login } = useAuthStore();

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    Keyboard.dismiss();
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      setAlertConfig({
        visible: true,
        title: "Authentication Failed",
        message:
          error.message || "Please check your credentials and try again.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.headerContainer}>
            <Typography variant="h1">Welcome Back</Typography>
            <Typography variant="caption">
              Sign in to securely access your dashboard
            </Typography>
          </View>

          <View style={styles.formContainer}>
            <InputField
              label="Email"
              name="email"
              control={control}
              error={errors.email?.message}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <InputField
              label="Password"
              name="password"
              control={control}
              error={errors.password?.message}
              placeholder="Enter your password"
              isPassword
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
            >
              <Typography
                variant="caption"
                weight="semibold"
                color={COLORS.primary}
              >
                Forgot Password?
              </Typography>
            </TouchableOpacity>

            <Button
              label="Sign In"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="Try Again"
        onConfirm={() => setAlertConfig({ ...alertConfig, visible: false })}
        onCancel={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </SafeAreaView>
  );
};

export const LoginScreen = withLoading(LoginScreenBase);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: SPACING.lg,
  },
  headerContainer: {
    marginBottom: SPACING.xl,
  },
  formContainer: {
    gap: SPACING.md,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: -4,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});
