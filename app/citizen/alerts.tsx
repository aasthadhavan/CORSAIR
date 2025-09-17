import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { getItem } from "../../services/storage";

export default function Alerts() {
  const [reports, setReports] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = async () => {
    const storedReports = (await getItem("reports")) || [];
    setReports(storedReports.reverse()); // newest first
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const hazard = item.hazardType
      ? item.hazardType.replace("_", " ").toUpperCase()
      : "UNKNOWN HAZARD";

    return (
      <View style={styles.card}>
        <Text style={styles.hazardType}>{hazard}</Text>
        <Text style={styles.description}>
          {item.desc || "No description provided"}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Unknown time"}
        </Text>
        <Text style={styles.status}>Status: {item.status || "pending"}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {reports.length === 0 ? (
        <Text style={styles.noReports}>No reports submitted yet</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a9e0dff4",
    padding: 15,
  },
  noReports: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#7F8C8D",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hazardType: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0077B6",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#2C3E50",
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#95A5A6",
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
  },
});
