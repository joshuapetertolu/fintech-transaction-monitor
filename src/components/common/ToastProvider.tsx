import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { Typography } from "@components/common/Typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast, ToastOptions } from "@utils/toast";
import { COLORS } from "@theme/index";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [toastData, setToastData] = useState<ToastOptions | null>(null);

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastData(null);
    });
  }, [translateY, opacity]);

  const showToast = useCallback(
    (options: ToastOptions) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setToastData(options);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        hideToast();
      }, options.duration || 3000);
    },
    [translateY, opacity, hideToast],
  );

  useEffect(() => {
    toast._subscribe(showToast);
    return () => toast._unsubscribe();
  }, [showToast]);

  const getToastStyles = () => {
    switch (toastData?.type) {
      case "success":
        return {
          backgroundColor: COLORS.surface,
          borderLeftColor: COLORS.primary,
          icon: "checkmark-circle",
          iconColor: COLORS.primary,
        };
      case "error":
        return {
          backgroundColor: COLORS.surface,
          borderLeftColor: COLORS.error,
          icon: "alert-circle",
          iconColor: COLORS.error,
        };
      default:
        return {
          backgroundColor: "#1E293B",
          borderLeftColor: "#1E293B",
          icon: "information-circle",
          iconColor: COLORS.surface,
          textColor: COLORS.surface,
        };
    }
  };

  const toastConfig = getToastStyles();

  return (
    <View style={styles.container}>
      {children}
      {toastData && (
        <Animated.View
          style={[
            styles.toastWrapper,
            {
              top: Math.max(insets.top, 20),
              transform: [{ translateY }],
              opacity,
              backgroundColor: toastConfig.backgroundColor,
              borderLeftColor: toastConfig.borderLeftColor,
            },
            toastData.type !== "info" && styles.glassmorphism,
          ]}
        >
          <View style={styles.content}>
            <Ionicons
              name={toastConfig.icon as any}
              size={24}
              color={toastConfig.iconColor}
              style={styles.icon}
            />
            <Typography
              style={[
                styles.message,
                { color: toastConfig.textColor || COLORS.text },
              ]}
              numberOfLines={2}
              weight="semibold"
            >
              {toastData.message}
            </Typography>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toastWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 5,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  glassmorphism: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});
