import React, { useEffect, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Device from 'expo-device';
import SecurityLogger from '@utils/SecurityLogger';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from '@navigation/RootNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_900Black 
} from '@expo-google-fonts/inter';

import { ToastProvider } from '@components/common/ToastProvider';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isCompromised, setIsCompromised] = useState(false);

  useEffect(() => {
    const checkDeviceIntegrity = async () => {
      try {
        const rooted = await Device.isRootedExperimentalAsync();
        if (rooted) {
          SecurityLogger.log("SECURITY WARNING: Device is compromised (Rooted/Jailbroken).");
          setIsCompromised(true);
        }
      } catch (error) {
        SecurityLogger.log("Device integrity check error:", error);
      }
    };
    checkDeviceIntegrity();
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isCompromised) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>Security Violation</Text>
        <Text style={{ textAlign: 'center' }}>This device appears to be rooted or compromised. For your security, the application cannot proceed.</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <NavigationContainer>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </View>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
