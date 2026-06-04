import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBKNLrG0kOqwZfnOlGZwgOZnRMuF1zJJ84',
  authDomain: 'remindernotificationapp-7c2d5.firebaseapp.com',
  projectId: 'remindernotificationapp-7c2d5',
  storageBucket: 'remindernotificationapp-7c2d5.firebasestorage.app',
  messagingSenderId: '88492151081',
  appId: '1:88492151081:android:47e3dba381808b50bbe738',
};

const app = initializeApp(firebaseConfig);

export default app;
// ❌ JANGAN export messaging - tidak bisa di Expo Go!