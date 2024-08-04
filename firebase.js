// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGzwGrVBPRCgiBXThGvzJf_Ycite0aw6Q",
  authDomain: "pantry-app-c9d11.firebaseapp.com",
  projectId: "pantry-app-c9d11",
  storageBucket: "pantry-app-c9d11.appspot.com",
  messagingSenderId: "135723940483",
  appId: "1:135723940483:web:c080831d0b3c4ca89f39b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Export Firestore instance for use in other parts of the application
export { firestore };
