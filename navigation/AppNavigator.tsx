import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '@/src/screens/Login';
import OtpVerification from '@/src/screens/OtpVerification';
import Home from '@/src/screens/Home';
import NewChatOptionList from '@/src/screens/NewChatOptionList';
import NewGroup from '@/src/screens/NewGroup';
import CreateGroup from '@/src/screens/CreateGroup';
import MessagesList from '@/src/screens/Messages';
import ProfileScreen from '@/src/screens/Profile';
import SplashScreen from '@/src/screens/Splash';
import NameInputScreen from '@/src/screens/NameInputScreen';
import CreateContact from '@/src/screens/CreateContact';
import ProfileInputScreen from '@/src/screens/ProfileInputScreen';
import AboutScreen from '@/src/screens/About';

// Define types for your navigation
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();


export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="About">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectUser"
          component={NewChatOptionList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewGroup"
          component={NewGroup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MessagesList"
          component={MessagesList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NameInputScreen"
          component={NameInputScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateContact"
          component={CreateContact}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ProfileInputScreen"
          component={ProfileInputScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ headerShown: false,
            gestureDirection: "horizontal",
            transitionSpec: {
              open: { animation: "timing", config: { duration: 200 } },
              close: { animation: "timing", config: { duration: 200 } },
            },
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0], // Slide from right to left
                    }),
                  },
                ],
              },
            }),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}