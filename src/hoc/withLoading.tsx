import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@theme/index';

export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: P & { isLoading?: boolean }) => {
    const { isLoading = false, ...rest } = props;
    return (
      <View style={styles.container}>
        <WrappedComponent {...(rest as P)} />
        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
