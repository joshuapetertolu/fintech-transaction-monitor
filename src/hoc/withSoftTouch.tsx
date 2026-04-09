import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, ViewStyle, StyleProp } from 'react-native';

export function withSoftTouch<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultScale: number = 0.94
) {
  return (props: P & { style?: StyleProp<ViewStyle> }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: defaultScale,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={(props as any).onPress}
      >
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, props.style]}>
          <WrappedComponent {...(props as P)} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };
}
