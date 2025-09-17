import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Animated, Alert, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function CitizenLayout() {
  const router = useRouter();

  const CustomHeader = ({ title, showBack = true }: { title: string, showBack?: boolean }) => {
    // Animation values for header elements
    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const slideAnimation = useRef(new Animated.Value(-50)).current;
    const waveAnimation = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      // Header entrance animation
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnimation, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous wave animation for background
      const waveLoop = () => {
        Animated.sequence([
          Animated.timing(waveAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(waveAnimation, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ]).start(() => waveLoop());
      };
      waveLoop();
    }, []);

    const handleLogout = () => {
      // Button press animation
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Logout", 
            style: "destructive",
            onPress: () => router.push("/auth/login")
          }
        ]
      );
    };

    const handleBackPress = () => {
      // Button press animation
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      router.back();
    };

    // Wave background animation
    const AnimatedWave = () => {
      const translateX = waveAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
      });

      return (
        <View style={styles.waveContainer}>
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
      );
    };

    return (
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#a9e0dff4', '#a9e0dff4', '#1f7d7bf4']}
          style={styles.header}
        >
          <AnimatedWave />
          
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnimation,
                transform: [{ translateY: slideAnimation }],
              },
            ]}
          >
            {/* Left Side - Back Button */}
            <View style={styles.headerLeft}>
              {showBack && (
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity 
                    onPress={handleBackPress}
                    style={styles.headerButton}
                    activeOpacity={0.8}
                  >
                    <View style={styles.buttonInner}>
                      <Ionicons name="arrow-back" size={22} color="#181f1eff" />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>

            {/* Center - Title with Icon */}
            <View style={styles.headerCenter}>
              <View style={styles.titleContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons name="water" size={16} color="#fff" />
                </View>
                <Text style={styles.headerTitle}>{title}</Text>
              </View>
              <Text style={styles.headerSubtitle}>CORSAIR</Text>
            </View>

            {/* Right Side - Logout Button */}
            <View style={styles.headerRight}>
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity 
                  onPress={handleLogout}
                  style={styles.headerButton}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonInner}>
                    <Ionicons name="log-out-outline" size={22} color="#162f2dff" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Floating Elements */}
          <View style={styles.floatingElements}>
            <Animated.View 
              style={[
                styles.floatingDot,
                styles.dot1,
                {
                  transform: [{
                    translateY: waveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  }],
                },
              ]}
            />
            <Animated.View 
              style={[
                styles.floatingDot,
                styles.dot2,
                {
                  transform: [{
                    translateY: waveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-5, 5],
                    }),
                  }],
                },
              ]}
            />
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationDuration: 300,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: "Citizen Dashboard",
          header: () => <CustomHeader title="Citizen Dashboard" showBack={false} />,
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="report" 
        options={{
          title: "Report Hazard",
          header: () => <CustomHeader title="Report Ocean Hazard" />,
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
        }}
      />
      <Stack.Screen 
        name="alerts" 
        options={{
          title: "Alerts",
          header: () => <CustomHeader title="Active Alerts" />,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="analytics" 
        options={{
          title: "Analytics",
          header: () => <CustomHeader title="Report Analytics" />,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="heatmap" 
        options={{
          title: "Hazard Map",
          header: () => <CustomHeader title="Hazard Heat Map" />,
          animation: 'fade',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    zIndex: 1000,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  wave: {
    width: width * 2,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    position: 'absolute',
    top: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    zIndex: 2,
  },
  headerLeft: {
    width: 50,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 50,
    alignItems: 'flex-end',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(130, 156, 168, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a0b0bff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(28, 3, 64, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(208, 151, 151, 0.1)',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1,
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dot1: {
    width: 20,
    height: 20,
    top: 30,
    right: 30,
  },
  dot2: {
    width: 14,
    height: 14,
    top: 60,
    left: 40,
  },
});