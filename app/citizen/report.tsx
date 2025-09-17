import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Animated, 
  StyleSheet, 
  Dimensions,
  Image,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getItem, setItem } from "../../services/storage";

const { width } = Dimensions.get("window");

const hazardTypes = [
  { id: 'pollution', name: 'Ocean Pollution', icon: 'warning', color: '#FF6B6B' },
  { id: 'debris', name: 'Marine Debris', icon: 'trash', color: '#4ECDC4' },
  { id: 'oil_spill', name: 'Oil Spill', icon: 'water', color: '#45B7D1' },
  { id: 'dead_marine', name: 'Dead Marine Life', icon: 'fish', color: '#96CEB4' },
  { id: 'algae', name: 'Harmful Algae', icon: 'leaf', color: '#A8E6CF' },
  { id: 'other', name: 'Other Hazard', icon: 'alert-circle', color: '#FFB74D' },
];

export default function Report() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [selectedHazard, setSelectedHazard] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Animation values
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Start entrance animations
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

    // Request permissions
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted' || locationStatus !== 'granted') {
      Alert.alert('Permissions Required', 'This app needs camera and location permissions to function properly.');
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      Alert.alert('Location Captured', 'Your current location has been added to the report.');
    } catch (error) {
      Alert.alert('Location Error', 'Could not get your location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const pickImage = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add a photo to your report',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const submitReport = async () => {
    if (!description.trim()) {
      Alert.alert("Missing Information", "Please provide a description of the hazard.");
      return;
    }

    if (!selectedHazard) {
      Alert.alert("Missing Information", "Please select a hazard type.");
      return;
    }

    setIsSubmitting(true);

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
      const reports = (await getItem("reports")) || [];
      const newReport = {
        id: Date.now(),
        desc: description.trim(),
        hazardType: selectedHazard,
        status: "pending",
        timestamp: Date.now(),
        image: selectedImage,
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        } : null,
      };

      await setItem("reports", [...reports, newReport]);
      
      Alert.alert(
        "Report Submitted!",
        "Thank you for helping protect our oceans. Your report has been submitted for review.",
        [
          { 
            text: "OK", 
            onPress: () => {
              setDescription("");
              setSelectedHazard("");
              setSelectedImage(null);
              setLocation(null);
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHazardSelect = (hazardId: string) => {
    setSelectedHazard(hazardId);
    
    // Add haptic feedback if available
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnimation,
            transform: [{ translateY: slideAnimation }],
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={['#85afc6ff', '#567379ff']}
            style={styles.headerCard}
          >
            <Ionicons name="shield-checkmark" size={40} color="#fff" />
            <Text style={styles.headerTitle}>Report Ocean Hazard</Text>
            <Text style={styles.headerSubtitle}>Help us protect marine life</Text>
          </LinearGradient>
        </View>

        {/* Hazard Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What type of hazard did you find?</Text>
          <View style={styles.hazardGrid}>
            {hazardTypes.map((hazard) => (
              <TouchableOpacity
                key={hazard.id}
                onPress={() => handleHazardSelect(hazard.id)}
                style={[
                  styles.hazardCard,
                  selectedHazard === hazard.id && styles.hazardCardSelected,
                ]}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.hazardIcon,
                    { 
                      backgroundColor: selectedHazard === hazard.id ? hazard.color : '#F8F9FA',
                    },
                  ]}
                >
                  <Ionicons
                    name={hazard.icon as any}
                    size={24}
                    color={selectedHazard === hazard.id ? '#fff' : hazard.color}
                  />
                </View>
                <Text
                  style={[
                    styles.hazardName,
                    selectedHazard === hazard.id && styles.hazardNameSelected,
                  ]}
                >
                  {hazard.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe the hazard</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Provide detailed description of what you observed..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.textInput}
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.characterCount}>
            {description.length}/500 characters
          </Text>
        </View>

        {/* Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Photo Evidence</Text>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                <Ionicons name="close-circle" size={30} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
              <LinearGradient
                colors={['#39a8a0ff', '#0d3433ff']}
                style={styles.imagePickerGradient}
              >
                <Ionicons name="camera" size={40} color="#fff" />
                <Text style={styles.imagePickerText}>Add Photo</Text>
                <Text style={styles.imagePickerSubtext}>Tap to capture or select</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
            style={styles.locationButton}
          >
            <View style={styles.locationButtonContent}>
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#0077B6" />
              ) : (
                <Ionicons
                  name={location ? "location" : "location-outline"}
                  size={24}
                  color={location ? "#4CAF50" : "#0077B6"}
                />
              )}
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationButtonText}>
                  {location ? "Location Captured" : "Get Current Location"}
                </Text>
                <Text style={styles.locationButtonSubtext}>
                  {location 
                    ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
                    : "Tap to add your current location"
                  }
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={submitReport}
              disabled={isSubmitting}
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF4757']}
                style={styles.submitGradient}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.submitButtonText}>Submitting...</Text>
                  </View>
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="#d0ababff" />
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a9e0dff4',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 30,
  },
  headerCard: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  hazardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hazardCard: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  hazardCardSelected: {
    borderColor: '#0077B6',
    shadowColor: '#0077B6',
    shadowOpacity: 0.2,
  },
  hazardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  hazardName: {
    fontSize: 12,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '500',
  },
  hazardNameSelected: {
    color: '#0077B6',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'right',
    marginTop: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  imagePickerButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  imagePickerGradient: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 10,
  },
  imagePickerSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  locationButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  locationButtonSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  submitSection: {
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});