import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen/HomeScreen.jsx';
import ZenScreen from './screens/ZenScreen/ZenScreen.jsx';
import StatsScreen from './screens/StatsScreen/StatsScreen.jsx';
import SettingsScreen from './screens/SettingsScreen/SettingsScreen.jsx'; // Now contains SettingsScreen
import CalendarScreen from './screens/CalendarScreen/CalendarScreen.jsx';
import NavigationBar from './components/NavigationBar.jsx';

import CreateTask from './components/CreateTask.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { useThemedStyles } from './hooks/useThemedStyles';
import ErrorBoundary from './components/ErrorBoundary';

import {
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/**
 * Main App Component
 * This component serves as the entry point for the application.
 * It sets up the navigation container and defines the main stack navigator with various screens.
 * 
 * @function App
 * @returns {JSX.Element}
 */


// Define the main stack navigator for the app
const MainStack = createNativeStackNavigator();
function AppWrapper() {
  const { styles } = useThemedStyles();
  
  return (
    <SafeAreaView style={[styles.container, {flex: 1}]}>
      <NavigationContainer onStateChange={() => {}}>
        <View style={[styles.container, {flex: 1, marginBottom: 82}]}>
          <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="HomeScreen" component={HomeScreen} />
            <MainStack.Screen name="ZenScreen" component={ZenScreen} />
            <MainStack.Screen name="StatsScreen" component={StatsStackScreen} />
            <MainStack.Screen name="SettingsScreen" component={SettingsStackScreen} />
            <MainStack.Screen name="CalendarScreen" component={CalendarScreen} />
            <MainStack.Screen name="CreateTask" component={CreateTask} />
          </MainStack.Navigator>
        </View>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <NavigationBar  />
        </View>
      </NavigationContainer>
      
    </SafeAreaView>
  );
}

function App() {
  // Request notification permission on app startup for Android 13+
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'This app needs notification permission to show focus session timers and app blocking status.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
          } else {
            console.log('Notification permission denied');
          }
        } catch (err) {
          console.warn('Error requesting notification permission:', err);
        }
      }
    };

    requestNotificationPermission();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <AppWrapper />
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


// Define the stack navigators for Stats
const StatsStack = createNativeStackNavigator();
function StatsStackScreen() {
  return (
    <StatsStack.Navigator screenOptions={{ headerShown: false }}>
      <StatsStack.Screen name="StatsStackScreen" component={StatsScreen} />
    </StatsStack.Navigator>
  );
}

// Define the stack navigators for Profile
const SettingsStack = createNativeStackNavigator();
function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsStackScreen" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

export default App;