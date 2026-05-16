import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MOCK_PREDICTIONS = [
  {
    question: "Who will win the toss in MI vs CSK?",
    options: ["Mumbai Indians", "Chennai Super Kings"],
    points: 100,
    status: "active",
    difficulty: "normal",
    active: true,
    createdAt: Date.now()
  },
  {
    question: "Will the next ball be a Boundary (4 or 6)?",
    options: ["Yes", "No"],
    points: 250,
    status: "active",
    difficulty: "high",
    active: true,
    createdAt: Date.now()
  },
  {
    question: "Total runs in the 15th over > 12.5?",
    options: ["Over", "Under"],
    points: 150,
    status: "active",
    difficulty: "normal",
    active: true,
    createdAt: Date.now()
  },
  {
    question: "Will Jasprit Bumrah take a wicket this over?",
    options: ["Yes", "No"],
    points: 300,
    status: "active",
    difficulty: "high",
    active: true,
    createdAt: Date.now()
  },
  {
    question: "Next delivery speed > 145 km/h?",
    options: ["Yes", "No"],
    points: 120,
    status: "active",
    difficulty: "normal",
    active: true,
    createdAt: Date.now()
  }
];

async function seed() {
  console.log("🚀 Starting seeding process...");
  
  try {
    const colRef = collection(db, "live_predictions");
    
    // Clear existing (optional - for a clean start)
    const snapshot = await getDocs(colRef);
    console.log(`Cleaning up ${snapshot.size} existing predictions...`);
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }

    console.log("Adding new mock predictions...");
    for (const pred of MOCK_PREDICTIONS) {
      const docRef = await addDoc(colRef, pred);
      console.log(`Added prediction: ${pred.question} (ID: ${docRef.id})`);
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
