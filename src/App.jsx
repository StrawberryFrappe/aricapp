import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen/HomeScreen.jsx';
import SearchScreen from './screens/SearchScreen/SearchScreen.jsx';
import ZenScreen from './screens/PublishScreen/ZenScreen.jsx';
import MediationScreen from './screens/MediationScreen/MediationScreen.jsx';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen.jsx';
import CalendarScreen from './screens/CalendarScreen/CalendarScreen.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import InnerMediationScreen from './screens/MediationScreen/InnerMediationScreen.jsx'
import EditProfileScreen from './screens/ProfileScreen/EditProfileScreen.jsx';
import ExtendedEvent from './screens/CalendarScreen/_components/ExtendedEvent.jsx';

import {
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './styles/commonStyles';

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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <NavigationContainer onStateChange={() => {}}>
        <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
          <MainStack.Navigator screenOptions={{ headerShown: false }}>
          <MainStack.Screen name="HomeScreen" component={HomeScreen} />
          <MainStack.Screen name="SearchScreen" component={SearchScreen} />
          <MainStack.Screen name="PublishScreen" component={ZenScreen} />
          <MainStack.Screen name="MediationScreen" component={MediationStackScreen} />
          <MainStack.Screen name="ProfileScreen" component={ProfileStackScreen} />
          <MainStack.Screen name="CalendarScreen" component={CalendarScreen} />
          <MainStack.Screen name="ExtendedEvent" component={ExtendedEvent} />
        </MainStack.Navigator>
        </SafeAreaView>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <NavigationBar  />
        </View>
        
        
        
      </NavigationContainer>
      
    </SafeAreaView>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppWrapper />
    </SafeAreaProvider>
  );
}


// Define the stack navigators for Mediation
const MediationStack = createNativeStackNavigator();
function MediationStackScreen() {
  return (
    <MediationStack.Navigator screenOptions={{ headerShown: false }}>
      <MediationStack.Screen name="MediationStackScreen" component={MediationScreen} />
      <MediationStack.Screen name="InnerMediationScreen" component={InnerMediationScreen} />
    </MediationStack.Navigator>
  );
}

// Define the stack navigators for Profile
const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileStackScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  textLight: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  textDark: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default App;