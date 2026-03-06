import React from 'react';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';

import { HomeScreen } from '@/screens/HomeScreen';
import { PreviewScreen } from '@/screens/PreviewScreen';

export type RootStackParamList = {
  Home: undefined;
  Preview: { id: string; imageUrl: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  );
}

