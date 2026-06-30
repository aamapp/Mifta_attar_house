import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "../types";

export async function saveFirebaseUserProfile(profile: UserProfile) {
  if (!db) return false;
  try {
    const userRef = doc(db, "mifta_user_profiles", profile.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error("Firebase user profile upsert failed:", err);
    return false;
  }
}

export async function updateFirebaseFCMToken(uid: string, token: string) {
  if (!db) return false;
  try {
    const userRef = doc(db, "mifta_user_profiles", uid);
    // Use setDoc with merge: true instead of updateDoc to ensure it works even if doc doesn't exist
    await setDoc(userRef, {
      fcmToken: token, // Keep for backward compatibility
      fcmTokens: arrayUnion(token),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error("Firebase FCM token update failed:", err);
    return false;
  }
}

export async function getFirebaseUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  try {
    const userRef = doc(db, "mifta_user_profiles", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error("Firebase user profile fetch failed:", err);
    return null;
  }
}
