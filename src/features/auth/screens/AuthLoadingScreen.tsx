import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, StatusBar } from "react-native";
import { useAuthStore } from "@store/useAuthStore";
import { COLORS } from "@theme/index";

export const AuthLoadingScreen = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      initializeAuth();
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, initializeAuth]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logoText}>SohCahToa</Text>
        <View style={styles.badge}>
          <Text style={styles.tagline}>FINTECH MONITOR</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },
  badge: {
    marginTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagline: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 2,
  },
});
