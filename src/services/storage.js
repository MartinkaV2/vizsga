import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";

export async function saveQuiz(name, data) {
  await addDoc(collection(db, "quizzes"), {
    name,
    data
  });
}

export async function getQuizzes() {
  const snapshot = await getDocs(collection(db, "quizzes"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}