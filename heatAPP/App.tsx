
import React, { useCallback, useEffect, useState } from 'react';
import { Home } from './src/screens/home';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Text, View } from 'react-native';

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';

import { AuthProvider } from './src/hooks/auth';

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        
        await Font.loadAsync({
          Roboto_400Regular: require('@expo-google-fonts/roboto/Roboto_400Regular.ttf'),
          Roboto_700Bold: require('@expo-google-fonts/roboto/Roboto_700Bold.ttf'),
        });

      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
   
    return null;
  }

  return (
    <AuthProvider>
      <View
        onLayout={onLayoutRootView}>
      </View>
      <Home />
    </AuthProvider >
  );
}


