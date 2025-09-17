import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getItem, setItem } from "../../services/storage";

const { width, height } = Dimensions.get("window");

const roles = [
  { id: "citizen", name: "Citizen Reporter", icon: "person", description: "Report ocean hazards" },
  { id: "validator", name: "Validator", icon: "checkmark-circle", description: "Verify reports" },
  { id: "admin", name: "Administrator", icon: "shield", description: "Manage system" },
];

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"citizen" | "validator" | "admin">("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const router = useRouter();

  // Animations
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const roleAnimations = useRef(roles.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    // Fade & Slide in
    Animated.parallel([
      Animated.timing(fadeAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnimation, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Wave animation loop
    const loopWave = () => {
      Animated.sequence([
        Animated.timing(waveAnimation, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(waveAnimation, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ]).start(() => loopWave());
    };
    loopWave();
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return { strength: 0, text: "Too short", color: "#ff4757" };
    if (pwd.length < 8) return { strength: 1, text: "Weak", color: "#ffa726" };
    if (pwd.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) return { strength: 3, text: "Strong", color: "#66bb6a" };
    return { strength: 2, text: "Medium", color: "#42a5f5" };
  };

  const handleRoleSelect = (roleId: string, index: number) => {
    setSelectedRole(roleId as any);
    // Animate selection
    Animated.sequence([
      Animated.timing(roleAnimations[index], { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(roleAnimations[index], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) return Alert.alert("Missing Information", "Please fill in all fields");
    if (!validateEmail(email)) return Alert.alert("Invalid Email", "Please enter a valid email address");
    if (password !== confirmPassword) return Alert.alert("Password Mismatch", "Passwords do not match");
    if (password.length < 6) return Alert.alert("Weak Password", "Password must be at least 6 characters long");

    setIsLoading(true);

    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    try {
      const users = (await getItem("users")) || [];
      if (users.find((u: any) => u?.email === email)) {
        setIsLoading(false);
        return Alert.alert("Email Already Exists", "This email is already registered");
      }

      const newUser = { email, password, role: selectedRole };
      await setItem("users", [...users, newUser]);

      Alert.alert("Success!", "Account created successfully", [
        { text: "OK", onPress: () => router.replace("/auth/login") }
      ]);
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const AnimatedWave = () => {
    const translateX = waveAnimation.interpolate({ inputRange: [0, 1], outputRange: [-width, width] });
    return (
      <View style={styles.waveContainer}>
        <Animated.View style={[styles.wave, { transform: [{ translateX }] }]} />
      </View>
    );
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <LinearGradient colors={['#0077B6', '#190242ff', '#240545ff']} style={styles.container}>
      <AnimatedWave />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.contentContainer, { opacity: fadeAnimation, transform: [{ translateY: slideAnimation }] }]}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-add" size={40} color="#80c8ecff" />
              </View>
              <Text style={styles.title}>Join CORSAIR</Text>
              <Text style={styles.subtitle}>Help protect our oceans</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Email */}
              <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
                <Ionicons name="mail-outline" size={20} color={emailFocused ? "#1c2385ff" : "#666"} />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
                {email && validateEmail(email) && <Ionicons name="checkmark-circle" size={20} color="#66bb6a" />}
              </View>

              {/* Password */}
              <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
                <Ionicons name="lock-closed-outline" size={20} color={passwordFocused ? "#180d56ff" : "#666"} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Password Strength */}
              {password.length > 0 && (
                <View style={styles.passwordStrength}>
                  <View style={styles.strengthBar}>
                    <View style={[styles.strengthFill, { width: `${(passwordStrength.strength / 3) * 100}%`, backgroundColor: passwordStrength.color }]} />
                  </View>
                  <Text style={[styles.strengthText, { color: passwordStrength.color }]}>{passwordStrength.text}</Text>
                </View>
              )}

              {/* Confirm Password */}
              <View style={[styles.inputContainer, confirmPasswordFocused && styles.inputFocused]}>
                <Ionicons name="lock-closed-outline" size={20} color={confirmPasswordFocused ? "#0077B6" : "#666"} />
                <TextInput
                  placeholder="Confirm password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
                </TouchableOpacity>
                {confirmPassword && password === confirmPassword && <Ionicons name="checkmark-circle" size={20} color="#66bb6a" style={{ marginLeft: 5 }} />}
              </View>

              {/* Roles */}
              <View style={styles.roleSection}>
                <Text style={styles.roleTitle}>Choose your role</Text>
                <View style={styles.rolesContainer}>
                  {roles.map((role, index) => (
                    <Animated.View key={role.id} style={[styles.roleOption, selectedRole === role.id && styles.roleSelected, { transform: [{ scale: roleAnimations[index] }] }]}>
                      <TouchableOpacity onPress={() => handleRoleSelect(role.id, index)} style={styles.roleButton}>
                        <Ionicons name={role.icon as any} size={24} color={selectedRole === role.id ? "#84d0b9ff" : "#67675dff"} />
                        <Text style={[styles.roleName, selectedRole === role.id && styles.roleNameSelected]}>{role.name}</Text>
                        <Text style={[styles.roleDescription, selectedRole === role.id && styles.roleDescriptionSelected]}>{role.description}</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </View>

              {/* Signup Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity onPress={handleSignup} disabled={isLoading} style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}>
                  <LinearGradient colors={['#dfdecbff', '#3a515cff']} style={styles.buttonGradient}>
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#291818ff" />
                        <Text style={styles.buttonText}>Creating account...</Text>
                      </View>
                    ) : (
                      <Text style={styles.buttonText}>Create Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  waveContainer: { position: 'absolute', top: height * 0.1, left: 0, right: 0, height: 100, overflow: 'hidden' },
  wave: { width: width * 2, height: 100, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50 },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingVertical: 40 },
  contentContainer: { paddingHorizontal: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(139, 202, 203, 0.9)', textAlign: 'center' },
  formContainer: { marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 239, 239, 0.95)', borderRadius: 15, paddingHorizontal: 20, paddingVertical: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, borderWidth: 2, borderColor: 'transparent' },
  inputFocused: { borderColor: '#1d73a2ff', backgroundColor: '#cef3f7bc' },
  input: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' },
  eyeIcon: { padding: 5 },
  passwordStrength: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  strengthBar: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginRight: 10 },
  strengthFill: { height: 4, borderRadius: 2 },
  strengthText: { fontSize: 12, width: 60 },
  roleSection: { marginVertical: 20 },
  roleTitle: { fontSize: 15, color: '#ffffffff', marginBottom: 10 },
  rolesContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  roleOption: { flex: 1, marginHorizontal: 5 },
  roleSelected: { borderColor: '#ffffffff', borderWidth: 2, borderRadius: 15 },
  roleButton: { alignItems: 'center', padding: 10 },
  roleName: { color: '#e1d6d6ff', fontWeight: '600', marginTop: 5 },
  roleNameSelected: { color: '#46bacbff' },
  roleDescription: { color: '#a3bfceff', fontSize: 12, textAlign: 'center' },
  roleDescriptionSelected: { color: '#bee3eaff' },
  signupButton: { borderRadius: 15, overflow: 'hidden', marginTop: 10 },
  signupButtonDisabled: { opacity: 0.7 },
  buttonGradient: { paddingVertical: 15, alignItems: 'center', borderRadius: 15 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#62aba4ff' },
  loginLink: { color: '#7ba0c9ff', fontWeight: '700', marginLeft: 5 },
});
