import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAoWmiB-q6J4lfUEY2CGQRoFJ1s1btg3Is",
  authDomain: "info-6132-lab-02-b2ed0.firebaseapp.com",
  projectId: "info-6132-lab-02-b2ed0",
  storageBucket: "info-6132-lab-02-b2ed0.appspot.com",
  messagingSenderId: "910453557626",
  appId: "1:910453557626:web:450e1922d6664108f52ec3"
};

const app = initializeApp(firebaseConfig);

export const FIRESTORE_DB = getFirestore(app);

