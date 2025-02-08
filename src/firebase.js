
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA4vz8TZZ8VI5vnzmrTegiubzrI5bn-rG0", 
    authDomain: "metrage-d74ef.firebaseapp.com",
    projectId: "metrage-d74ef",
    storageBucket: "metrage-d74ef.firebasestorage.app",
    messagingSenderId: "775041825334",
    appId: "1:775041825334:web:5b221615b2f88587053697",
    measurementId: "G-M71V1WN43N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 

export default app; 