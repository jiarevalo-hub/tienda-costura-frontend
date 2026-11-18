import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD0RBNUX7xxyXFK497Mz37eoK-0u7GdiOc',
  authDomain: 'tienda-7c2ac.firebaseapp.com',
  projectId: 'tienda-7c2ac',
  storageBucket: 'tienda-7c2ac.firebasestorage.app',
  messagingSenderId: '270525668701',
  appId: '1:270525668701:web:3cf57781ac8d83468c1cb4',
  measurementId: 'G-9HNE6279VL',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
