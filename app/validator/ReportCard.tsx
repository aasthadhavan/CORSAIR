import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReportCard = ({ report, onApprove, onReject }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animatePress = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{report.title || "Untitled Report"}</Text>
        <Text style={styles.detail}>Status: {report.status}</Text>
        <Text style={styles.detail}>Location: {report.location || "Unknown"}</Text>
      </View>
      <View style={styles.actions}>
        {report.status === "pending" && (
          <>
            <TouchableOpacity
              onPress={onApprove}
              onPressIn={() => animatePress(0.95)}
              onPressOut={() => animatePress(1)}
              style={styles.approveBtn}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onReject}
              onPressIn={() => animatePress(0.95)}
              onPressOut={() => animatePress(1)}
              style={styles.rejectBtn}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );
};

export default ReportCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 15, fontWeight: "600", color: "#333" },
  detail: { fontSize: 12, color: "#666", marginTop: 2 },
  actions: { flexDirection: "row", marginLeft: 10 },
  approveBtn: {
    backgroundColor: "#06D6A0",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  rejectBtn: {
    backgroundColor: "#EF476F",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
});
