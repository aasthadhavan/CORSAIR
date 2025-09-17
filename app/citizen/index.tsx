import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, TouchableOpacity, ScrollView, Animated, StyleSheet, Dimensions, Alert, 
  Linking,
  Modal
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getItem } from "../../services/storage";

interface Report {
  id: number;
  desc: string;
  status: 'pending' | 'verified' | 'rejected';
  timestamp?: number;
}


// app/citizen/index.tsx
// (Removed duplicate import block)

const { width } = Dimensions.get("window");

interface Report {
  id: number;
  desc: string;
  status: 'pending' | 'verified' | 'rejected';
  timestamp?: number;
}

export default function CitizenHome() {
  const router = useRouter();
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [userName, setUserName] = useState("");
  const [hotlineVisible, setHotlineVisible] = useState(false);

  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(30)).current;
  const cardAnimations = useRef([0,1,2,3].map(()=>new Animated.Value(0))).current;
  const pressAnim = useRef([0,1,2,3].map(()=>new Animated.Value(1))).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnimation, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Staggered menu card animation
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, { toValue: 1, duration: 600, delay: 200*index, useNativeDriver: true }).start();
    });

    // Wave background loop
    const loopWave = () => {
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 4000, useNativeDriver: false }),
        Animated.timing(waveAnim, { toValue: 0, duration: 4000, useNativeDriver: false }),
      ]).start(() => loopWave());
    };
    loopWave();

  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await getItem("currentUser");
      if (currentUser?.email) setUserName(currentUser.email.split('@')[0]);
      const reports = (await getItem("reports")) || [];
      setUserReports(reports.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  const handlePressIn = (index:number) => Animated.spring(pressAnim[index], { toValue:0.95, useNativeDriver:true }).start();
  const handlePressOut = (index:number) => Animated.spring(pressAnim[index], { toValue:1, useNativeDriver:true }).start();

  const menuItems: {
    title: string;
    description: string;
    icon: string;
    route: string;
    colors: [string, string];
  }[] = [
    { title: "Report Hazard", description: "Report a new ocean hazard", icon: "warning", route: "/citizen/report", colors: ["#f03434ff","#8c5151ff"] },
    { title: "View Alerts", description: "Check active hazard alerts", icon: "notifications", route: "/citizen/alerts", colors: ["#ede72aff","#bcc554ff"] },
    { title: "Analytics", description: "View your reporting statistics", icon: "bar-chart", route: "/citizen/analytics", colors: ["#45B7D1","#187890ff"] },
    { title: "Heat Map", description: "Explore hazard heat map", icon: "map", route: "/citizen/heatmap", colors: ["#b07f1eff","#d14e1aff"] },
  ];

  const getStatusColor = (status:string)=> status==='verified'? '#4CAF50': status==='pending'? '#FF9800':'#F44336';
  const getStatusIcon = (status:string)=> status==='verified'? 'checkmark-circle': status==='pending'? 'time':'close-circle';

  const translateXWave = waveAnim.interpolate({ inputRange:[0,1], outputRange:[-width,width] });

  // Emergency Hotlines
  const hotlines = [
    { name: "Indian Coast Guard", number: "1554" },
    { name: "National Disaster Management", number: "1078" },
    { name: "Marine Rescue Coordination", number: "02224307295" },
    { name: "Pollution Control Board", number: "18002333364" },
    { name: "National Emergency Helpline", number: "112" },
  ];

  const callHotline = (number:string) => {
    Linking.openURL(`tel:${number}`).catch(() => Alert.alert("Error", "Unable to make the call"));
    setHotlineVisible(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Floating Wave Background */}
      <Animated.View style={[styles.waveBackground, { transform:[{translateX:translateXWave}] }]} />

      {/* Welcome */}
      <Animated.View style={{ opacity:fadeAnimation, transform:[{translateY:slideAnimation}], padding:20 }}>
        <LinearGradient colors={['#a9e0dff4','#a9e0dff4','#328e9eff']} style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>WELCOME,</Text>
            <Text style={styles.userName}>{userName || "CORSAIR"}</Text>
            <Text style={styles.welcomeSubtext}>Ready to protect our oceans today?</Text>
          </View>
          <View style={styles.waveIcon}><Ionicons name="water" size={60} color="rgba(19, 104, 160, 0.3)" /></View>
        </LinearGradient>
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View style={{ opacity:fadeAnimation, paddingHorizontal:20, marginBottom:20 }}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statNumber}>{userReports.length}</Text><Text style={styles.statLabel}>Reports</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{userReports.filter(r=>r.status==='verified').length}</Text><Text style={styles.statLabel}>Verified</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{userReports.filter(r=>r.status==='pending').length}</Text><Text style={styles.statLabel}>Pending</Text></View>
        </View>
      </Animated.View>

      {/* Menu Cards */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item,index)=>(
            <Animated.View key={item.title} style={{
              opacity:cardAnimations[index],
              transform:[{ translateY: cardAnimations[index].interpolate({inputRange:[0,1], outputRange:[30,0]}) }, { scale: pressAnim[index] }]
            }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={()=>handlePressIn(index)}
                onPressOut={()=>handlePressOut(index)}
                onPress={()=>router.push(item.route as any)}
                style={styles.menuCard}
              >
                <LinearGradient colors={item.colors} style={styles.menuCardGradient}>
                  <View style={styles.menuIconContainer}><Ionicons name={item.icon as any} size={28} color="#ffffffff" /></View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Recent Reports */}
      {userReports.length>0 && (
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          {userReports.map(report=>(
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportIconContainer}><Ionicons name={getStatusIcon(report.status)} size={20} color={getStatusColor(report.status)} /></View>
                <View style={styles.reportContent}>
                  <Text style={styles.reportDescription} numberOfLines={2}>{report.desc}</Text>
                  <Text style={[styles.reportStatus,{color:getStatusColor(report.status)}]}>{report.status.charAt(0).toUpperCase()+report.status.slice(1)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Emergency Hotline */}
      <View style={styles.emergencySection}>
        <TouchableOpacity style={styles.emergencyButton} onPress={()=>setHotlineVisible(true)}>
          <LinearGradient colors={['#793434ff','#FF4757']} style={styles.emergencyGradient}>
            <Ionicons name="call" size={24} color="#fff" />
            <Text style={styles.emergencyText}>Emergency Hotline</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Hotline Modal */}
      <Modal visible={hotlineVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Emergency Hotline</Text>
            {hotlines.map((hotline,index)=>(
              <TouchableOpacity 
                key={index} 
                style={styles.hotlineOption} 
                onPress={()=>callHotline(hotline.number)}
              >
                <Ionicons name="call" size={20} color="#b42d63ff" />
                <Text style={styles.hotlineText}>{hotline.name} ({hotline.number})</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={()=>setHotlineVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#a9e0dff4'},
  welcomeCard:{borderRadius:20, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.15, shadowRadius:10, elevation:8},
  welcomeContent:{padding:25, paddingRight:80},
  welcomeText:{fontSize:16, color:'rgba(0, 0, 0, 0.9)', marginBottom:5},
  userName:{fontSize:25,fontWeight:'500',color:'#210202ff',marginBottom:8,textTransform:'capitalize'},
  welcomeSubtext:{fontSize:14,color:'rgba(31, 3, 3, 0.8)'},
  waveIcon:{position:'absolute',right:20,top:20},
  waveBackground:{position:'absolute',bottom:0,width:width*2,height:100,borderRadius:50,backgroundColor:'rgba(0,123,255,0.1)'},
  sectionTitle:{fontSize:19,fontWeight:'300',color:'#2C3E50',marginBottom:15},
  statsRow:{flexDirection:'row',justifyContent:'space-between'},
  statCard:{backgroundColor:'#010413ff',padding:20,borderRadius:15,alignItems:'center',flex:1,marginHorizontal:5,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:4,elevation:3},
  statNumber:{fontSize:24,fontWeight:'700',color:'#ffffffff',marginBottom:5},
  statLabel:{fontSize:12,color:'#91f8ffff',textAlign:'center'},
  menuSection:{paddingHorizontal:20,marginBottom:30},
  menuGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},
  menuCard:{borderRadius:15,overflow:'hidden',shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.15,shadowRadius:8,elevation:6},
  menuCardGradient:{padding:20,minHeight:120,justifyContent:'center',alignItems:'center'},
  menuIconContainer:{width:50,height:50,borderRadius:25,backgroundColor:'rgba(255,255,255,0.2)',justifyContent:'center',alignItems:'center',marginBottom:10},
  menuTitle:{fontSize:16,fontWeight:'600',color:'#ffffffff',textAlign:'center',marginBottom:5},
  menuDescription:{fontSize:12,color:'rgba(0, 0, 0, 0.9)',textAlign:'center'},
  reportsSection:{paddingHorizontal:20,marginBottom:30},
  reportCard:{backgroundColor:'#bcedf6e6',borderRadius:15,padding:15,marginBottom:10,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:4,elevation:3},
  reportHeader:{flexDirection:'row',alignItems:'center'},
  reportIconContainer:{width:40,height:40,borderRadius:20,backgroundColor:'#ffffffff',justifyContent:'center',alignItems:'center',marginRight:15},
  reportContent:{flex:1},
  reportDescription:{fontSize:15,color:'#081625ff',marginBottom:5},
  reportStatus:{fontSize:12,fontWeight:'600',textTransform:'uppercase'},
  emergencySection:{paddingHorizontal:20,paddingBottom:30},
  emergencyButton:{borderRadius:15,overflow:'hidden',shadowColor:'#FF6B6B',shadowOffset:{width:0,height:4},shadowOpacity:0.3,shadowRadius:8,elevation:6},
  emergencyGradient:{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:15,paddingHorizontal:20},
  emergencyText:{fontSize:16,fontWeight:'600',color:'#fff',marginLeft:10},
  modalOverlay:{flex:1,backgroundColor:"rgba(0,0,0,0.5)",justifyContent:"center",alignItems:"center"},
  modalContent:{width:"85%",backgroundColor:"#fff",borderRadius:15,padding:20,shadowColor:"#000",shadowOpacity:0.25,shadowOffset:{width:0,height:2},shadowRadius:6},
  modalTitle:{fontSize:18,fontWeight:"700",marginBottom:15,color:"#2C3E50",textAlign:"center"},
  hotlineOption:{flexDirection:"row",alignItems:"center",paddingVertical:12,borderBottomWidth:1,borderColor:"#EEE"},
  hotlineText:{marginLeft:10,fontSize:14,color:"#2C3E50"},
  closeButton:{marginTop:15,alignSelf:"center"},
  closeText:{fontSize:16,fontWeight:"600",color:"#78161eff"}
});
