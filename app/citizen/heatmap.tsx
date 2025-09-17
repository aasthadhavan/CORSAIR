// app/citizen/heatmap.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Heatmap } from "react-native-maps";
import { getItem } from "../../services/storage";

const { width, height } = Dimensions.get("window");

interface Report {
  id: number;
  lat: number;
  lng: number;
  type: string;
  status: string;
}

export default function CitizenHeatmap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const storedReports = (await getItem("reports")) || [];
        setReports(storedReports);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0077B6" />
        <Text style={{ marginTop: 10, color: "#0077B6" }}>Loading Heatmap...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // required for Heatmap on iOS
        style={styles.map}
        initialRegion={{
          latitude: 20,
          longitude: 78,
          latitudeDelta: 15,
          longitudeDelta: 15,
        }}
      >
        {/* Heatmap */}
        <Heatmap
          points={reports.map(r => ({
            latitude: r.lat || 20,
            longitude: r.lng || 78,
            weight: r.status === "critical" ? 2 : 1, // weight critical reports higher
          }))}
          radius={50}
          opacity={0.6}
        />

        {/* Markers for critical reports */}
        {reports
          .filter(r => r.status === "critical")
          .map((r, i) => (
            <Marker
              key={i}
              coordinate={{ latitude: r.lat || 20, longitude: r.lng || 78 }}
              title={r.type}
              description={`Status: ${r.status}`}
              pinColor="red"
            />
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
});
