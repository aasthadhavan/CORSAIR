// app/validator/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function ValidatorLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#a9e0dff4" },
        headerTintColor: "#180909ff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Validator Dashboard", // center title
        }}
      />
    </Stack>
  );
}
