import React, { useRef, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-100)).current; 

  useEffect(() => {
   
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout from Admin Panel?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/auth/login"),
      },
    ]);
  };

  
  const CustomHeader = ({
    title,
    showBack = true,
    showLogout = true,
  }: {
    title: string;
    showBack?: boolean;
    showLogout?: boolean;
  }) => (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
      }}
    >
      <LinearGradient
        colors={["#a9e0dff4", "#a9e0dff4", "#477d7cf4"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContainer}>
          {/* Left - Back button */}
          <View style={styles.headerLeft}>
            {showBack && (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.headerButton}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* Center - Title */}
          <View style={styles.headerCenter}>
            <View style={styles.titleContainer}>
              <Ionicons name="shield-checkmark" size={20} color="#000000ff" />
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <Text style={styles.headerSubtitle}>Admin Panel</Text>
          </View>

          {/* Right - Logout */}
          <View style={styles.headerRight}>
            {showLogout && (
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.headerButton}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={22} color="#160909ff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // --- Stack Navigator for admin --- //
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Admin Dashboard",
          header: () => (
            <CustomHeader title="Dashboard" showBack={false} showLogout />
          ),
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: "User Management",
          header: () => <CustomHeader title="User Management" />,
        }}
      />
      <Stack.Screen
        name="reports"
        options={{
          title: "Report Management",
          header: () => <CustomHeader title="Reports" />,
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: "System Analytics",
          header: () => <CustomHeader title="Analytics" />,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "System Settings",
          header: () => <CustomHeader title="Settings" />,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          header: () => <CustomHeader title="Notifications" />,
        }}
      />
      <Stack.Screen
        name="smanalytics"
        options={{
          title: "Social Media Analytics",
          header: () => (
            <CustomHeader
              title="Social Media Analytics"
              showBack={true}
              showLogout={true}
            />
          ),
        }}
      />
    </Stack>
  );
}

// --- Styles --- //
const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 35, // dynamic status bar padding
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    minHeight: 50,
  },
  headerLeft: {
    width: 50,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    width: 50,
    alignItems: "flex-end",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000ff",
    marginLeft: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(24, 5, 5, 0.85)",
    textAlign: "center",
    fontWeight: "500",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});
