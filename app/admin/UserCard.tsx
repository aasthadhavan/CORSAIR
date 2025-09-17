import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UserCard = ({ user, onRemove }: any) => {
  const scale = useRef(new Animated.Value(1)).current;
  const elevation = useRef(new Animated.Value(3)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }),
      Animated.timing(elevation, { toValue: 8, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(elevation, { toValue: 3, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const roleColor =
    user.role === "admin"
      ? "#0077B6"
      : user.role === "validator"
      ? "#FF6F00"
      : "#28A745";

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale }],
          elevation: elevation, // Android shadow
          shadowOpacity: Platform.OS === "ios" ? 0.15 : undefined, // iOS shadow
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={[styles.role, { color: roleColor }]}>Role: {user.role}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(user.email)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Ionicons name="trash-outline" size={24} color="#DC3545" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  email: { fontSize: 14, fontWeight: "600", color: "#333" },
  role: { fontSize: 12, fontWeight: "500" },
});
