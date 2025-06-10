import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDoaTYhR-mU4WiaStnYfz61g7sJpAcjLr4",
  authDomain: "hospital-project-e1282.firebaseapp.com",
  projectId: "hospital-project-e1282",
  storageBucket: "hospital-project-e1282.firebasestorage.app",
  messagingSenderId: "203151242269",
  appId: "1:203151242269:web:cee98c77cb9c2ae04302f4",
  measurementId: "G-DHVQX7BE2F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
