import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import config from "../../firebase-applet-config.json";

const app = initializeApp(config);
export const db = getFirestore(app);

export async function submitFeedback(metadata: string, rating: number, comment: string) {
  try {
    await addDoc(collection(db, "feedback"), {
      metadata,
      rating,
      comment,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (e) {
    console.error("Error submitting feedback:", e);
    return false;
  }
}
