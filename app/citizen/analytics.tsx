// app/citizen/analytics.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView } from "react-native";
import { getItem } from "../../services/storage";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, ProgressChart } from "react-native-chart-kit";

type Report = { status: "resolved" | "pending" | string; reportedDate: string };

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const [reports, setReports] = useState<Report[]>([]);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      const storedReports = (await getItem("hazardReports")) || [];
      setReports(storedReports);
    })();

    Animated.timing(animatedValue, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const total = reports.length;
  const approved = reports.filter(r => r.status === "resolved").length;
  const pending = reports.filter(r => r.status === "pending").length;

  // Prepare trend chart data (reports per day)
  const reportDates = reports.map(r => new Date(r.reportedDate).toDateString());
  const dateCounts: { [key: string]: number } = {};
  reportDates.forEach(date => (dateCounts[date] = (dateCounts[date] || 0) + 1));
  const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const trendData = sortedDates.map(date => dateCounts[date]);

  const fadeIn = { 
    opacity: animatedValue, 
    transform: [{ translateY: animatedValue.interpolate({ inputRange: [0,1], outputRange: [30,0] }) }] 
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Citizen Analytics</Text>

      {/* Animated Stats Cards */}
      <Animated.View style={[styles.cardsContainer, fadeIn]}>
        <View style={[styles.card, { backgroundColor: "#0077B6" }]}>
          <Ionicons name="layers-outline" size={28} color="#fff" />
          <Text style={styles.cardNumber}>{total}</Text>
          <Text style={styles.cardLabel}>Total Reports</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#28A745" }]}>
          <Ionicons name="checkmark-done-outline" size={28} color="#fff" />
          <Text style={styles.cardNumber}>{approved}</Text>
          <Text style={styles.cardLabel}>Approved</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#FFA500" }]}>
          <Ionicons name="time-outline" size={28} color="#fff" />
          <Text style={styles.cardNumber}>{pending}</Text>
          <Text style={styles.cardLabel}>Pending</Text>
        </View>
      </Animated.View>

      {/* Circular Progress */}
      <Text style={styles.sectionTitle}>Approval Rate</Text>
      <ProgressChart
        data={{ data: [total === 0 ? 0 : approved / total] }}
        width={screenWidth - 40}
        height={180}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`,
          strokeWidth: 2,
        }}
        hideLegend={false}
      />

      {/* Trend Line Chart */}
      <Text style={styles.sectionTitle}>Reports Over Time</Text>
      {trendData.length > 0 ? (
        <LineChart
          data={{
            labels: sortedDates.map(d => d.split(" ")[1] + " " + d.split(" ")[2]), // Month Day
            datasets: [{ data: trendData }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`,
            strokeWidth: 2,
            decimalPlaces: 0,
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 12, color: "#666" }}>No reports to show trend.</Text>
      )}

      {/* Heatmap Placeholder */}
      <Text style={styles.sectionTitle}>Hotspots (Heatmap)</Text>
      <View style={styles.heatmap}>
        <Text style={{ color: "#0077B6", fontWeight: "600", marginBottom: 6 }}>• Oil spill — Chennai coast</Text>
        <Text style={{ color: "#0077B6", fontWeight: "600", marginBottom: 6 }}>• Plastic cluster — Mumbai port</Text>
        <Text style={{ color: "#666" }}></Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#a9e0dff4" },
  title: { fontSize: 22, fontWeight: "700", color: "#0077B6", marginBottom: 20 },
  cardsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: { flex: 1, padding: 16, borderRadius: 16, marginHorizontal: 4, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width:0,height:2 }, shadowRadius: 4 },
  cardNumber: { fontSize: 24, fontWeight: "700", color: "#fff", marginTop: 8 },
  cardLabel: { fontSize: 12, color: "#fff", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 16, marginBottom: 12, color: "#0077B6" },
  heatmap: { backgroundColor: "#fff", borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width:0,height:2 }, shadowRadius: 4 },
});
