
 import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const StatsCard = ({ icon, number, label, color }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse loop (scale only)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY }, { scale: pulseAnim }],
        },
      ]}
    >
      <Ionicons name={icon} size={28} color={color} />
      <Text
        style={[
          styles.number,
          {
            color:
              number > 50 ? "#28A745" : number > 10 ? "#2c366fff" : "#DC3545",
          },
        ]}
      >
        {number}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
};

export default StatsCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: (width - 60) / 3,
    backgroundColor: "rgba(198, 208, 211, 0.95)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  number: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
});
