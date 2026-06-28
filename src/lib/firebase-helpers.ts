import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "../types";

export async function saveFirebaseUserProfile(profile: UserProfile) {
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
  try {
    const userRef = doc(db, "mifta_user_profiles", uid);
    await updateDoc(userRef, {
      fcmToken: token,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    // If doc doesn't exist, we might need to create it, but usually update is fine if profile was created
    console.error("Firebase FCM token update failed:", err);
    return false;
  }
}

export async function getFirebaseUserProfile(uid: string): Promise<UserProfile | null> {
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
