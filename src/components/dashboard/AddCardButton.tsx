import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@theme/index';
import { withSoftTouch } from '@hoc/withSoftTouch';

const AddCardBase = () => {
  return (
    <View style={styles.container}>
      <Feather name="plus" size={24} color={COLORS.text} />
    </View>
  );
};

export const AddCardButton = withSoftTouch(AddCardBase, 0.95);

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 160,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#4D4D4D',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginVertical: 15,
  },
});
