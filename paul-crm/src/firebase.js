import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "api-key",
  authDomain: "domain.com",
  projectId: "crm",
  storageBucket: "crm.appspot.com",
  messagingSenderId: "id",
  appId: "id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const customers = collection(db,"customers")
export const companies = collection(db, "companies")