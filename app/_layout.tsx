import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { I18nextProvider } from "react-i18next";
import "../services/i18n"; // import i18n once



// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Keep empty or use system fonts for now
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null; // Keep your original behavior
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#0077B6" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: "Ocean Guardian",
          }}
        />
        <Stack.Screen 
          name="auth/login"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="auth/signup"
          options={{
            animation: 'slide_from_bottom',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="citizen"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="validator"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="admin"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
