/**
 * Khởi tạo Firebase (chỉ Firestore). Config đọc từ .env.local — xem .env.example.
 * Nếu chưa cấu hình, `db` = null và UI online sẽ hiện hướng dẫn thay vì crash.
 */
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const env = import.meta.env ?? ({} as ImportMetaEnv);

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(config.apiKey && config.projectId && config.appId);

export const db = firebaseReady
  ? initializeFirestore(initializeApp(config), { ignoreUndefinedProperties: true })
  : null;
