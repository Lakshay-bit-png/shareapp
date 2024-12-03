import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCZY5efDDehWlVFT-56orZau5KNx0MJ5Qk",
    authDomain: "pookie-95ae2.firebaseapp.com",
    projectId: "pookie-95ae2",
    storageBucket: "pookie-95ae2.firebasestorage.app",
    messagingSenderId: "705366904569",
    appId: "1:705366904569:web:ca8004ac4e462858059c28",
    measurementId: "G-XWS3GR0SKL"
  };
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
