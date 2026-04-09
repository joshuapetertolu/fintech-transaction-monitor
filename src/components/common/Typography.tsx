import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { COLORS } from "@theme/index";

interface TypographyProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "error";
  color?: string;
  weight?: "normal" | "medium" | "semibold" | "bold" | "900";
  align?: "auto" | "left" | "center" | "right" | "justify";
}

const getFontFamily = (
  weight?: TypographyProps["weight"],
  variant?: TypographyProps["variant"],
) => {
  if (weight) {
    switch (weight) {
      case "medium":
        return "Inter_500Medium";
      case "semibold":
        return "Inter_600SemiBold";
      case "bold":
        return "Inter_700Bold";
      case "900":
        return "Inter_900Black";
      case "normal":
        return "Inter_400Regular";
    }
  }

  switch (variant) {
    case "h1":
      return "Inter_700Bold";
    case "h2":
      return "Inter_600SemiBold";
    case "h3":
      return "Inter_600SemiBold";
    case "body":
      return "Inter_400Regular";
    case "caption":
      return "Inter_400Regular";
    case "error":
      return "Inter_400Regular";
    default:
      return "Inter_400Regular";
  }
};

export const Typography = ({
  variant = "body",
  color,
  weight,
  align,
  style,
  children,
  ...props
}: TypographyProps) => {
  const fontFamily = getFontFamily(weight, variant);

  const textStyle = [
    styles.base,
    styles[variant],
    color ? { color } : null,
    { fontFamily },
    align ? { textAlign: align } : null,
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: COLORS.text,
  },
  h1: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    letterSpacing: -0.4,
  },
  h3: {
    fontSize: 18,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  error: {
    fontSize: 12,
    color: COLORS.error,
  },
});
