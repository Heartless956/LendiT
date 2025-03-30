import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBapps5bmcguEBeYrIxvD2-JWxCulvI35E",
  authDomain: "lendit-490d0.firebaseapp.com",
  projectId: "lendit-490d0",
  storageBucket: "lendit-490d0.firebasestorage.app",
  messagingSenderId: "114853562981",
  appId: "1:114853562981:web:e6d07ccd2591e3d0b9148c",
  measurementId: "G-SQY6LHZ5CZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sign up new users
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering:", error.message);
    throw error;
  }
};

// Sign in existing users
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out.");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

// Fetch items by logged-in user
export const fetchUserItems = async (userId) => {
  try {
    const q = query(collection(db, "items"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user items:", error);
    return [];
  }
};

// Add item with userId
export const addItem = async (name, price, userId) => {
  try {
    await addDoc(collection(db, "items"), {
      Name: name,
      Price: Number(price),
      userId,
    });
    console.log("Item added successfully!");
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

export { db, auth };
