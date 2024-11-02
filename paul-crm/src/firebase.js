import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCYFUxdJsM0T6ApIE8BLF14OQj1GMGD7-4",
  authDomain: "paul-crm.firebaseapp.com",
  projectId: "paul-crm",
  storageBucket: "paul-crm.appspot.com",
  messagingSenderId: "627591975959",
  appId: "1:627591975959:web:8a5c083aa6dc0d2038f852"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const customerCollection = collection(db,"customers")