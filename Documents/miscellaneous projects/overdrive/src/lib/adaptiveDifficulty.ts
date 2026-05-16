import { db } from "./firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

interface PredictionRecord {
  id: string;
  isCorrect: boolean;
  timestamp: number;
}

export async function getAdaptivePredictions(userId: string) {
  try {
    // 1. Fetch user's past 10 predictions
    const predictionsRef = collection(db, "users", userId, "predictionHistory");
    const q = query(
      predictionsRef,
      orderBy("timestamp", "desc"),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    
    let correctCount = 0;
    let totalCount = 0;

    snapshot.forEach((doc) => {
      const data = doc.data() as PredictionRecord;
      if (data.isCorrect) {
        correctCount++;
      }
      totalCount++;
    });

    // Calculate win rate (default to 0 if no history)
    const winRate = totalCount > 0 ? (correctCount / totalCount) : 0;
    
    // 2. Determine difficulty level
    // Win rate exceeds 80% (0.8) triggers high difficulty
    const isHighDifficulty = winRate > 0.8;
    const difficultyLevel = isHighDifficulty ? "high" : "normal";

    // 3. Query the database for propositions matching the difficulty
    const livePredictionsRef = collection(db, "live_predictions");
    const diffQuery = query(
      livePredictionsRef,
      where("difficulty", "==", difficultyLevel),
      where("active", "==", true),
      limit(5)
    );

    const predictionsSnapshot = await getDocs(diffQuery);
    const predictions = predictionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      winRate,
      difficultyLevel,
      predictions
    };
  } catch (error) {
    console.error("Error evaluating adaptive difficulty:", error);
    // Fallback to normal difficulty on error
    return {
      winRate: 0,
      difficultyLevel: "normal",
      predictions: []
    };
  }
}
