import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet } from 'react-native';
import { 
  HomeScreen, 
  CalculatorScreen, 
  TransferScreen, 
  CardsScreen, 
  ProfileScreen 
} from '@/features/dashboard/screens/DashboardScreens';
import { COLORS } from '@/theme/index';
import { TabButton } from '@/components/navigation/TabButton';

const Tab = createBottomTabNavigator();

const ICONS = {
  home: require('@assets/navicons/home.png'),
  calculator: require('@assets/navicons/calculator.png'),
  repeat: require('@assets/navicons/repeat.png'),
  card: require('@assets/navicons/card.png'),
  profile: require('@assets/navicons/profile.jpg'),
};

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarButton: (props) => (
            <TabButton 
              {...props} 
              label="Home" 
              icon={ICONS.home} 
              isFocused={props.accessibilityState?.selected ?? false}
              style={styles.tabItemContainer}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Calculator" 
        component={CalculatorScreen}
        options={{
          tabBarButton: (props) => (
            <TabButton 
              {...props} 
              label="Calculator" 
              icon={ICONS.calculator} 
              isFocused={props.accessibilityState?.selected ?? false}
              style={styles.tabItemContainer}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Transfer" 
        component={TransferScreen}
        options={{
          tabBarButton: (props) => (
            <TabButton 
              {...props} 
              icon={ICONS.repeat} 
              isCenter={true}
              isFocused={props.accessibilityState?.selected ?? false}
              style={styles.tabItemContainer}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Cards" 
        component={CardsScreen}
        options={{
          tabBarButton: (props) => (
            <TabButton 
              {...props} 
              label="Cards" 
              icon={ICONS.card} 
              isFocused={props.accessibilityState?.selected ?? false}
              showDot={true}
              style={styles.tabItemContainer}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarButton: (props) => (
            <TabButton 
              {...props} 
              label="Profile" 
              icon={ICONS.profile} 
              isFocused={props.accessibilityState?.selected ?? false}
              isProfile={true}
              style={styles.tabItemContainer}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 96 : 80,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    flexDirection: 'row',
  },
  tabItemContainer: {
    flex: 1,
  },
});
