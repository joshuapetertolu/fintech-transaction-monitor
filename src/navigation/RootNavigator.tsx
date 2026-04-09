import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@store/useAuthStore';
import { LoginScreen } from '@features/auth/screens/LoginScreen';
import { AuthLoadingScreen } from '@features/auth/screens/AuthLoadingScreen';
import { 
  StyleSheet 
} from 'react-native';
import { MainTabNavigator } from '@navigation/MainTabNavigator';
import { TransactionDetailScreen } from '@features/transactions/screens/TransactionDetailScreen';
import { RootStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return <AuthLoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen 
            name="App" 
            component={MainTabNavigator} 
            options={{ animation: 'fade' }}
          />
          <Stack.Screen 
            name="TransactionDetail" 
            component={TransactionDetailScreen} 
            options={{ 
              headerShown: false,
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen 
          name="Auth" 
          component={LoginScreen} 
          options={{ animation: 'fade' }} 
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtext: {
    fontSize: 16,
    color: '#808080',
    marginTop: 8,
  },
});
