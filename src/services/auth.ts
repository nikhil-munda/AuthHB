import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt?: any;
}

export const syncUserProfile = async (
  user: { uid: string; email?: string | null; displayName?: string | null },
  fallbackName?: string
): Promise<UserProfile> => {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      uid: user.uid,
      name: data.name ?? user.displayName ?? fallbackName ?? "",
      email: data.email ?? user.email ?? "",
      createdAt: data.createdAt,
    };
  }

  const newProfile: UserProfile = {
    uid: user.uid,
    name: (user.displayName || fallbackName || "").trim(),
    email: user.email ?? "",
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    uid,
    name: data.name ?? "",
    email: data.email ?? "",
    createdAt: data.createdAt,
  };
};

export const signInWithGoogleCredential = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  return await signInWithCredential(auth, credential);
};

export const signInWithEmail = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const signUpWithEmail = async (
  email: string,
  pass: string,
  name?: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && name.trim()) {
    await updateProfile(userCredential.user, { displayName: name.trim() });
  }
  return userCredential;
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const logout = async () => {
  await signOut(auth);
};

export const getFirebaseErrorMessage = (err: any): string => {
  const code = err?.code;
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return err?.message ?? "Authentication failed. Please try again.";
  }
};
