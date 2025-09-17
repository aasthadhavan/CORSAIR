// app/admin/analytics.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen() {
  const data = [
    { name: "Positive", population: 65, color: "#4CAF50", legendFontColor: "#fff", legendFontSize: 12 },
    { name: "Neutral", population: 20, color: "#FFC107", legendFontColor: "#fff", legendFontSize: 12 },
    { name: "Negative", population: 15, color: "#F44336", legendFontColor: "#fff", legendFontSize: 12 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <LinearGradient colors={["#a9e0dff4", "#0f3037ff"]} style={styles.header}>
        <Text style={styles.headerText}>📊 Social Media Analytics</Text>
      </LinearGradient>

      <Text style={styles.title}>Sentiment Overview</Text>
      <PieChart
        data={data}
        width={width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#4c5f68ff",
          backgroundGradientFrom: "#003F5C",
          backgroundGradientTo: "#0077B6",
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#1d0e0eff",
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#a9e0dff4" },
  header: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#220202ff" },
  title: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 12 },
});
