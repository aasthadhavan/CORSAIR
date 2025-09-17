// app/validator/index.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getItem, setItem, removeItem } from "../../services/storage";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface Report {
  id: number;
  desc?: string;
  status: "pending" | "verified" | "rejected";
  location?: { latitude: number; longitude: number };
  timestamp?: number;
}

const TABS = ["All", "Pending", "Verified", "Rejected"] as const;

export default function ValidatorHome() {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("All");

  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadReports();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadReports = async () => {
    try {
      const storedReports = (await getItem("reports")) || [];
      setReports(storedReports);
    } catch (error) {
      console.error("Error loading reports:", error);
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: "verified" | "rejected"
  ) => {
    const updated = reports.map((r) => (r.id === id ? { ...r, status } : r));
    setReports(updated);
    await setItem("reports", updated);
    Alert.alert("Success", `Report marked as ${status}`);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await removeItem("currentUser");
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const stats = {
    total: reports.length,
    verified: reports.filter((r) => r.status === "verified").length,
    pending: reports.filter((r) => r.status === "pending").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
  };

  const filteredReports =
    activeTab === "All"
      ? reports
      : reports.filter((r) => r.status === activeTab.toLowerCase());

  const renderReport = ({ item }: { item: Report }) => {
    const statusColor =
      item.status === "verified"
        ? "#4CAF50"
        : item.status === "pending"
        ? "#FF9800"
        : "#F44336";

    return (
      <Animated.View
        style={[
          styles.reportCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.reportHeader}>
          <Ionicons
            name={
              item.status === "verified"
                ? "checkmark-circle"
                : item.status === "pending"
                ? "time"
                : "close-circle"
            }
            size={22}
            color={statusColor}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.reportTitle}>
            {item.desc?.trim() ? item.desc : "Unnamed Report"}
          </Text>
        </View>
        {item.location && (
          <Text style={styles.locationText}>
            📍 Lat: {item.location.latitude}, Lng: {item.location.longitude}
          </Text>
        )}
        <View style={styles.actionsRow}>
          <ActionButton
            label="Verify"
            color="#4CAF50"
            icon="checkmark"
            onPress={() => handleUpdateStatus(item.id, "verified")}
          />
          <ActionButton
            label="Reject"
            color="#F44336"
            icon="close"
            onPress={() => handleUpdateStatus(item.id, "rejected")}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#0077B6", "#a9e0dff4"]} style={styles.header}>
        <Text style={styles.headerText}></Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard label="Total" value={stats.total} color="#000000ff" icon="document-text" />
        <StatCard label="Verified" value={stats.verified} color="#4b985dff" icon="checkmark-done" />
        <StatCard label="Pending" value={stats.pending} color="#bfa378ff" icon="time" />
        <StatCard label="Rejected" value={stats.rejected} color="#a5362cff" icon="close" />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabWrapper}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Reports List */}
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReport}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reports available</Text>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Animated.View style={[styles.statCard, { backgroundColor: color + "15" }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

function ActionButton({
  label,
  color,
  icon,
  onPress,
}: {
  label: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionBtn, { backgroundColor: color }]}
    >
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#a9e0dff4" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  headerText: { fontSize: 20, fontWeight: "700", color: "#000000ff" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },
  statCard: {
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    width: width / 4.5,
  },
  statValue: { fontSize: 18, fontWeight: "700", marginTop: 5 },
  statLabel: { fontSize: 12, color: "#555", marginTop: 2 },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabWrapper: { alignItems: "center", flex: 1, paddingVertical: 10 },
  tabText: { fontSize: 14, fontWeight: "600", color: "#555" },
  activeTabText: { color: "#0077B6" },
  tabIndicator: {
    marginTop: 4,
    height: 3,
    width: "60%",
    borderRadius: 2,
    backgroundColor: "#d4e5efff",
  },
  reportCard: {
    backgroundColor: "#f0e9e9ff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  reportHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  reportTitle: { fontSize: 16, fontWeight: "600", color: "#2C3E50", flex: 1 },
  locationText: { fontSize: 13, color: "#555", marginBottom: 10 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  actionText: { color: "#ffffffff", fontWeight: "600", marginLeft: 6 },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
    fontSize: 16,
  },
});
