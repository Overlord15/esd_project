// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYw2BzBhBbgJwd99csjnfq6eX-4wunVrU",
  authDomain: "esdproject-497e5.firebaseapp.com",
  projectId: "esdproject-497e5",
  storageBucket: "esdproject-497e5.firebasestorage.app",
  messagingSenderId: "239938606992",
  appId: "1:239938606992:web:225013627e3dff138e4515",
  measurementId: "G-80NGRTVFCE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
