// app/welcome.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Welcome() {
  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center", padding:20 }}>
      <Text style={{ fontSize:28, fontWeight:"700", color:"#0077B6", marginBottom:20 }}>🌊 </Text>
      <Text style={{ textAlign:"center", marginBottom:30 }}>Crowdsourced Ocean Risk & Social Analytics Integrated Reporting</Text>

      <Link href="/auth/signup" asChild>
        <TouchableOpacity style={{ backgroundColor:"#0077B6", padding:14, borderRadius:10, width:"80%", marginBottom:12 }}>
          <Text style={{ color:"#fff", textAlign:"center", fontWeight:"700" }}>Create Account</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/auth/login" asChild>
        <TouchableOpacity style={{ backgroundColor:"#00B4D8", padding:14, borderRadius:10, width:"80%" }}>
          <Text style={{ color:"#fff", textAlign:"center", fontWeight:"700" }}>Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
