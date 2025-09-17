import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getItem } from "../services/storage";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const dotAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Wave animation loop
    const waveLoop = () => {
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.timing(waveAnim, { toValue: 0, duration: 2500, useNativeDriver: false }),
      ]).start(() => waveLoop());
    };
    waveLoop();

    // Loading dots animation
    const animateDots = () => {
      const sequences = dotAnims.map((dot, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 200),
            Animated.timing(dot, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 0, duration: 600, useNativeDriver: true }),
          ])
        )
      );
      Animated.parallel(sequences).start();
    };
    animateDots();

    // Check user authentication
    const checkUser = async () => {
      await new Promise(r => setTimeout(r, 1800)); // small delay for smooth UX
      try {
        const userStr = await getItem("currentUser");
        if (!userStr) {
          router.replace("/auth/login");
        } else {
          let currentUser;
          try {
            currentUser = JSON.parse(userStr); // Parse string into object
          } catch {
            router.replace("/auth/login");
            return;
          }
          // Redirect based on role
          if (currentUser.role === "citizen") router.replace("/citizen");
          else if (currentUser.role === "validator") router.replace("/validator");
          else router.replace("/admin");
        }
      } catch {
        router.replace("/auth/login");
      }
    };

    checkUser();
  }, []);

  // Animated wave component
  const AnimatedWave = () => {
    const translateX1 = waveAnim.interpolate({ inputRange: [0, 1], outputRange: [-width, width] });
    const translateX2 = waveAnim.interpolate({ inputRange: [0, 1], outputRange: [width, -width] });

    return (
      <View style={styles.waveContainer}>
        <Animated.View style={[styles.wave1, { transform: [{ translateX: translateX1 }] }]} />
        <Animated.View style={[styles.wave2, { transform: [{ translateX: translateX2 }] }]} />
      </View>
    );
  };

  // Loading dots component
  const LoadingDots = () => (
    <View style={styles.dotsContainer}>
      {dotAnims.map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              opacity: dot,
              transform: [
                { scale: dot.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) },
              ],
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient colors={["#0077B6", "#190242ff", "#240545ff", "#90E0EF"]} style={styles.container}>
      <AnimatedWave />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* App Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="water" size={60} color="#ffffffff" />
          </View>
        </View>

        {/* App Name & Tagline */}
        <Text style={styles.appName}>CORSAIR</Text>
        <Text style={styles.tagline}>Crowdsourced Ocean Risk and Social Analytics Integrated Reporting</Text>

        {/* Loading */}
        <View style={styles.loadingContainer}>
          <LoadingDots />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>

      {/* Floating Elements */}
      <View style={styles.floatingElements}>
        <Animated.View style={[styles.floatingCircle, styles.circle1, { transform: [{ translateY: waveAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circle2, { transform: [{ translateY: waveAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] }) }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circle3, { transform: [{ translateY: waveAnim.interpolate({ inputRange: [0, 1], outputRange: [5, -15] }) }] }]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  waveContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" },
  wave1: { position: "absolute", top: height * 0.2, width: width * 2, height: 100, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 50 },
  wave2: { position: "absolute", top: height * 0.7, width: width * 2, height: 80, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 40 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  iconContainer: { marginBottom: 30 },
  iconBackground: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(126, 119, 119, 0.15)",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12,
  },
  appName: { fontSize: 36, fontWeight: "700", color: "#fff", textAlign: "center", marginBottom: 8, textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  tagline: { fontSize: 16, color: "rgba(255,255,255,0.9)", textAlign: "center", marginBottom: 60, fontWeight: "300" },
  loadingContainer: { alignItems: "center", marginBottom: 40 },
  dotsContainer: { flexDirection: "row", marginBottom: 20 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#fff", marginHorizontal: 4 },
  loadingText: { fontSize: 16, color: "rgba(255,255,255,0.85)", fontWeight: "500" },
  versionText: { position: "absolute", bottom: 50, fontSize: 12, color: "rgba(255,255,255,0.6)" },
  floatingElements: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" },
  floatingCircle: { position: "absolute", borderRadius: 50, backgroundColor: "rgba(255,255,255,0.05)" },
  circle1: { width: 100, height: 100, top: height * 0.15, right: 30 },
  circle2: { width: 60, height: 60, top: height * 0.6, left: 20 },
  circle3: { width: 80, height: 80, bottom: height * 0.2, right: 60 },
});
