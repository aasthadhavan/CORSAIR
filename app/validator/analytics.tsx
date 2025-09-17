// app/validator/analytics.tsx
import React from "react";
import { View, Text, Dimensions, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

// Example Data
const sentimentData = [
  { name: "Positive", population: 65, color: "#4CAF50", legendFontColor: "#333", legendFontSize: 12 },
  { name: "Neutral", population: 20, color: "#FFC107", legendFontColor: "#333", legendFontSize: 12 },
  { name: "Negative", population: 15, color: "#F44336", legendFontColor: "#333", legendFontSize: 12 },
];

const engagementData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{ data: [120, 90, 150, 80, 200, 170, 220] }],
};

const platformData = {
  labels: ["Twitter", "Instagram", "Facebook", "LinkedIn"],
  datasets: [{ data: [80, 120, 60, 40] }],
};

export default function ValidatorAnalytics() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <LinearGradient colors={["#0077B6", "#00B4D8"]} style={styles.header}>
        <Text style={styles.headerText}>📊 Validator Analytics</Text>
        <Ionicons name="trending-up" size={28} color="#fff" />
      </LinearGradient>

      {/* Sentiment Analysis */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>Sentiment Analysis</Text>
        <PieChart
          data={sentimentData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </MotiView>

      {/* Engagement Trend */}
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200, duration: 800 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>Engagement Trend</Text>
        <LineChart
          data={engagementData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      </MotiView>

      {/* Platform Distribution */}
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 400, duration: 800 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>Platform Distribution</Text>
        <BarChart
          data={{
            labels: platformData.labels,
            datasets: platformData.datasets,
          }}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
          style={styles.chartStyle}
        />
      </MotiView>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#0077B6",
  backgroundGradientTo: "#00B4D8",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#333" },
  chartStyle: { borderRadius: 12 },
});
