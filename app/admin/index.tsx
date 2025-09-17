// app/admin/index.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { getItem, removeItem, User } from "../../services/storage";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, PieChart } from "react-native-chart-kit";
import MapView, { Marker } from "react-native-maps";
import StatsCard from "./StatsCard";
import UserCard from "./UserCard";
   // make sure you have UserCard component

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Floating animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Load user, users, reports
  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getItem("currentUser");
      if (!currentUser || currentUser.role !== "admin") {
        router.replace("/auth/login");
        return;
      }
      setUser(currentUser);

      const storedUsers = (await getItem("users")) || [];
      const storedReports = (await getItem("reports")) || [];
      setUsers(storedUsers);
      setReports(storedReports);
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    await removeItem("currentUser");
    router.replace("/auth/login");
  };

  const handleRemoveUser = async (email: string) => {
    const filtered = users.filter((u) => u.email !== email);
    setUsers(filtered);
    // TODO: also update storage
  };

  if (!user) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <Text style={{ color: "#230606ff" }}>Loading Admin Dashboard...</Text>
      </View>
    );
  }

  // Stats
  const totalUsers = users.length;
  const totalReports = reports.length;
  const approvedReports = reports.filter((r) => r.status === "approved").length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const criticalReports = reports.filter((r) => r.status === "critical").length;

  // Charts
  const lineData = {
    labels: ["Approved", "Pending", "Critical"],
    datasets: [{ data: [approvedReports, pendingReports, criticalReports] }],
  };
  const pieData = [
    { name: "Approved", population: approvedReports, color: "#28A745", legendFontColor: "#fff", legendFontSize: 12 },
    { name: "Pending", population: pendingReports, color: "#FFC107", legendFontColor: "#fff", legendFontSize: 12 },
    { name: "Critical", population: criticalReports, color: "#DC3545", legendFontColor: "#fff", legendFontSize: 12 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Floating Background */}
      <Animated.View
        style={[
          styles.floatingCircle,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircleSmall,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 30] }),
              },
            ],
          },
        ]}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user.name}</Text>
      </View>

      {/* Stats Cards in single line */}
      <View style={styles.cardsContainer}>
        <StatsCard icon="people-outline" number={totalUsers} label="Total Users" color="#a3b7c2ff" />

       

        <StatsCard icon="document-text-outline" number={totalReports} label="Total Reports" color="#00B4D8" />

        <StatsCard icon="alert-circle-outline" number={criticalReports} label="Critical Reports" color="#DC3545" />
         <TouchableOpacity onPress={() => router.push("/admin/smanalytics")}>
          <StatsCard icon="bar-chart-outline" number={0} label="Social Media Analytics" color="#a43694ff" />
        </TouchableOpacity>
      </View>

      {/* Charts */}
      <Text style={styles.sectionTitle}>Reports Analytics</Text>
      <LineChart
        data={lineData}
        width={width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#6d92a3ff",
          backgroundGradientFrom: "#003F5C",
          backgroundGradientTo: "#4e5051ff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#fff",
        }}
        style={{ borderRadius: 16, marginBottom: 20 }}
      />
      <PieChart
        data={pieData}
        width={width - 40}
        height={180}
        chartConfig={{ color: () => "#fff" }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* Map */}
      <Text style={styles.sectionTitle}>Hotspots</Text>
      <MapView
        style={{ width: "100%", height: 300, borderRadius: 16, marginBottom: 20 }}
        initialRegion={{ latitude: 20, longitude: 78, latitudeDelta: 15, longitudeDelta: 15 }}
      >
        {reports.filter((r) => r.lat && r.lng).map((r, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: r.lat, longitude: r.lng }}
            title={r.type || "Report"}
            description={`Status: ${r.status}`}
            pinColor={r.status === "critical" ? "red" : "blue"}
          />
        ))}
      </MapView>

      {/* Users List */}
      <Text style={styles.sectionTitle}>Users</Text>
      {users.map((u, i) => (
        <UserCard key={i} user={u} onRemove={handleRemoveUser} />
      ))}
    </ScrollView>
  );
}

// ----------------------------
// Styles
// ----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#a9e0dff4" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  welcome: { fontSize: 20, fontWeight: "bold", color: "#000000ff" },
  cardsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    marginBottom: 20,
    
  },
  sectionTitle: { color: "#260202ff", fontSize: 18, fontWeight: "300", marginBottom: 12 },
  floatingCircle: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.05)", right: 30 },
  floatingCircleSmall: { position: "absolute", width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.03)", left: 50, bottom: 50 },
});
