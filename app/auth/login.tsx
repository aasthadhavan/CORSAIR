import React, { useState, useRef } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getItem, setItem } from "../../services/storage";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const router = useRouter();
  
  // Animation values
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous wave animation
    const waveLoop = () => {
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]).start(() => waveLoop());
    };
    waveLoop();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const users = (await getItem("users")) || [];
      const user = users.find((u: any) => u?.email === email && u?.password === password);
      
      if (!user) {
        Alert.alert("Invalid Credentials", "Please check your email and password");
        setIsLoading(false);
        return;
      }

      await setItem("currentUser", { email: user.email, role: user.role });

      // Success animation before navigation
      setTimeout(() => {
        if (user.role === "citizen") router.replace("/citizen");
        else if (user.role === "validator") router.replace("/validator");
        else router.replace("/admin");
      }, 500);
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const AnimatedWave = () => {
    const translateX = waveAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    return (
      <View style={styles.waveContainer}>
        <Animated.View
          style={[
            styles.wave,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#0077B6', '#190242ff', '#240545ff']}
      style={styles.container}
    >
      <AnimatedWave />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          {/* Header */}
         <View style={styles.header}>
  <View style={styles.iconContainer}>
    <Ionicons name="water-outline" size={40} color="#fff" />
  </View>
  <Text style={styles.title}>CORSAIR</Text>
  <Text style={styles.subtitle}>Sign in to report hazards</Text>
</View>


          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
              <Ionicons name="mail-outline" size={20} color={emailFocused ? "#0077B6" : "#36196dff"} />
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#5e4c4cff"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={passwordFocused ? "#0077B6" : "#36196dff"} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#593434de"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#6200ffff"
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              >
                <LinearGradient
                  colors={['#ffffffff', '#b7c5cdff']}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.spinner} />
                      <Text style={styles.buttonText}>Signing in...</Text>
                    </View>
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  waveContainer: {
    position: 'absolute',
    top: height * 0.1,
    left: 0,
    right: 0,
    height: 100,
    overflow: 'hidden',
  },
  wave: {
    width: width * 2,
    height: 100,
    backgroundColor: 'rgba(252, 18, 18, 0.1)',
    borderRadius: 50,
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#d0e5f2ff',
    marginBottom: 8,
    textShadowColor: 'rgba(73, 56, 56, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(102, 153, 179, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#000000ff',
    backgroundColor: '#a9bee2ff',
  },
  input: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#36196dff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    marginRight: 10,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(161, 212, 217, 0.8)',
    fontSize: 16,
  },
  signupLink: {
    color: '#b1dfe5ff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});