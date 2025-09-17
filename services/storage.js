import AsyncStorage from "@react-native-async-storage/async-storage";
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {'citizen' | 'validator' | 'admin'} role
 * @property {string} email
 */

/**
 * @typedef {Object} HazardReport
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'low' | 'medium' | 'high' | 'critical'} severity
 * @property {{ address: string, latitude?: number, longitude?: number }} location
 * @property {'pending' | 'resolved' | 'investigating' | 'dismissed'} status
 * @property {string} reportedBy
 * @property {string} [validatedBy]
 * @property {string} [validatedDate]
 * @property {string} [validationNotes]
 * @property {string} reportedDate
 */


// Save value
export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage set error:", e);
  }
};

// Get value
export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error("Storage get error:", e);
    return null;
  }
};

// Remove value
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Storage remove error:", e);
  }
};

