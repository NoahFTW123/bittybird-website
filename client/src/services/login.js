import {auth, db} from "./firebaseConfig.js"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {doc, getDoc, getFirestore} from "firebase/firestore";

// Initialize Firebase Authentication and the provider
const provider = new GoogleAuthProvider();

// Function to handle Google Login
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // Return the authenticated user
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// Function to handle Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

// Updated to return the full user object, including `uid`
export const getCurrentUser = () => {
  const user = auth.currentUser;
  return user
    ? { uid: user.uid, displayName: user.displayName, email: user.email }
    : null;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const checkAdminRole = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data().role === "admin";
  }
  return false;
};
