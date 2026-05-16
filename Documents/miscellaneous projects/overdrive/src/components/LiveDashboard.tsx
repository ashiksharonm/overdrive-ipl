"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMomentum } from "@/hooks/useMomentum";
import { Confetti } from "./Confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Activity, TrendingUp, Users, Zap, CheckCircle2, XCircle } from "lucide-react";

interface Prediction {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  status: "active" | "resolved";
  points: number;
  difficulty: "normal" | "high";
}

interface Team {
  name: string;
  color: string;
  rgb: string;
}

export function LiveDashboard({ userId, favoriteTeam }: { userId: string, favoriteTeam: Team }) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Record<string, { option: string; isCorrect: boolean }>>({});
  const [difficultyLevel, setDifficultyLevel] = useState<"normal" | "high">("normal");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const { streak, multiplier, showConfetti, recordPrediction } = useMomentum();

  // Dynamic Match Header Logic
  const opponent = favoriteTeam.name === "Mumbai Indians" ? "Chennai Super Kings" : "Mumbai Indians";
  const scoreText = favoriteTeam.name === "Mumbai Indians" ? "178/4" : "162/6";
  const oversText = favoriteTeam.name === "Mumbai Indians" ? "(18.2 Overs)" : "(17.4 Overs)";

  useEffect(() => {
    const answeredCount = Object.keys(answered).length;
    if (answeredCount >= 3) {
      if (streak >= 3) {
        setDifficultyLevel("high");
      } else {
        setDifficultyLevel("normal");
      }
    }
  }, [answered, streak]);

  useEffect(() => {
    const q = query(
      collection(db, "live_predictions"),
      where("difficulty", "==", difficultyLevel),
      where("active", "==", true),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveData: Prediction[] = [];
      snapshot.forEach((doc) => {
        liveData.push({ id: doc.id, ...doc.data() } as Prediction);
      });
      setPredictions(liveData);
    });

    return () => unsubscribe();
  }, [difficultyLevel]);

  const handleAnswer = (prediction: Prediction, option: string) => {
    if (answered[prediction.id]) return;

    // Simulate result
    const isCorrect = Math.random() > 0.4;
    
    setAnswered((prev) => ({ 
      ...prev, 
      [prediction.id]: { option, isCorrect } 
    }));

    recordPrediction(isCorrect);
    
    if (isCorrect) {
      const pointsWon = prediction.points * multiplier;
      setScore((prev) => prev + pointsWon);
      setFeedback({ type: 'success', msg: `+${pointsWon} PTS! Great read!` });
    } else {
      setFeedback({ type: 'error', msg: "Incorrect! Better luck next ball." });
    }

    // Clear feedback after 2 seconds
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Confetti active={showConfetti} />

      {/* Dynamic Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              feedback.type === 'success' 
                ? 'bg-green-500 text-white border-green-400' 
                : 'bg-red-500 text-white border-red-400'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            <span className="font-bold text-lg">{feedback.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Match Info Header */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          layout
          className="md:col-span-2 glass p-6 rounded-2xl flex items-center justify-between border-l-4 transition-all duration-500"
          style={{ borderLeftColor: favoriteTeam.color }}
        >
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                Live: {favoriteTeam.name} vs {opponent}
              </span>
            </div>
            <div className="flex items-end space-x-4">
              <h2 className="text-4xl font-black italic">{scoreText}</h2>
              <span className="text-gray-400 font-medium mb-1">{oversText}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 font-semibold mb-1">Win Probability</p>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full" style={{ width: "65%", backgroundColor: favoriteTeam.color }} />
              <div className="h-full bg-white/20" style={{ width: "35%" }} />
            </div>
            <p className="text-[10px] mt-1 text-gray-500">{favoriteTeam.name.split(' ').pop()} 65% • {opponent.split(' ').pop()} 35%</p>
          </div>
        </motion.div>

        <div className="glass p-6 rounded-2xl flex flex-col justify-center items-center">
          <div className="flex items-center space-x-2 text-[var(--primary)] mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Fan Pulse</span>
          </div>
          <p className="text-2xl font-black">12.4K</p>
          <p className="text-[10px] text-gray-500">Fans Predicting Now</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-[var(--card-bg)] rounded-2xl p-6 shadow-xl border border-[var(--border-color)] mb-4 glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-4 mb-4 md:mb-0 relative z-10">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-[var(--primary)]/20 p-3 rounded-full border border-[var(--primary)]/50"
          >
            <Activity className="w-8 h-8 text-[var(--primary)]" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-purple-400 leading-tight">
              {difficultyLevel === "high" ? "Elite Mode" : "Rookie Zone"}
            </h1>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${difficultyLevel === "high" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"}`}>
                {difficultyLevel} difficulty
              </span>
              <TrendingUp className="w-3 h-3 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex space-x-6 relative z-10">
          <motion.div 
            key={score}
            initial={{ scale: 1.2, color: '#facc15' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="flex flex-col items-center p-4 bg-black/40 rounded-xl border border-white/10 min-w-[100px]"
          >
            <Trophy className="w-6 h-6 text-yellow-400 mb-1" />
            <span className="text-2xl font-black">{score}</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Points</span>
          </motion.div>
          <div className="flex flex-col items-center p-4 bg-black/40 rounded-xl border border-white/10 min-w-[100px] relative overflow-hidden">
            {streak >= 3 && (
              <motion.div 
                layoutId="streak-bg"
                className="absolute inset-0 bg-gradient-to-t from-orange-600/30 to-transparent" 
              />
            )}
            <Flame className={`w-6 h-6 mb-1 ${streak >= 3 ? "text-orange-500 animate-bounce" : "text-gray-500"}`} />
            <span className={`text-2xl font-black ${streak >= 3 ? "text-orange-400" : "text-white"}`}>
              {streak}
            </span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Streak</span>
            
            {multiplier > 1 && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-lg"
              >
                {multiplier}x
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Contextual Guideline */}
      <div className="mb-8 px-4 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <p className="text-xs text-gray-400">
          {streak === 0 && "Start your journey! Answer your first prediction to begin your streak."}
          {streak > 0 && streak < 3 && `Only ${3 - streak} more correct answers to hit OverDrive Mode (2x points)!`}
          {streak >= 3 && difficultyLevel === "normal" && "You're on fire! Keep winning to unlock Elite Mode for bigger rewards."}
          {difficultyLevel === "high" && "Elite Mode Active: You're facing the toughest predictions for maximum points!"}
        </p>
      </div>

      {/* Predictions Stream */}
      <div className="space-y-4">
        {predictions.length === 0 ? (
          <div className="text-center py-20 text-gray-400 glass rounded-3xl border-dashed border-2 border-white/5">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="text-lg font-medium opacity-50">Searching for high-impact moments...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {predictions.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group p-6 rounded-2xl border transition-all duration-300 glass hover:border-[var(--primary)]/50 relative overflow-hidden ${
                  answered[p.id] ? "opacity-60" : "opacity-100"
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.difficulty === 'high' ? 'bg-red-500' : 'bg-green-500'}`} />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[var(--primary)] tracking-widest mb-1 block">
                      {p.difficulty} Difficulty
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors">{p.question}</h3>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center">
                    <span className="block text-[10px] text-gray-500 font-bold uppercase">Reward</span>
                    <span className="text-lg font-black text-[var(--primary)]">{p.points * (answered[p.id] ? 1 : multiplier)} <span className="text-[10px]">PTS</span></span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {p.options.map((opt) => {
                    const answerData = answered[p.id];
                    const isSelected = answerData?.option === opt;
                    const isCorrect = answerData?.isCorrect;
                    
                    let btnClass = "border-white/5 bg-white/5 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 text-gray-400";
                    
                    if (isSelected) {
                      btnClass = isCorrect 
                        ? "border-green-500 bg-green-500/20 text-green-400 ring-4 ring-green-500/10 font-bold" 
                        : "border-red-500 bg-red-500/20 text-red-400 ring-4 ring-red-500/10 font-bold";
                    }

                    return (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={opt}
                        onClick={() => handleAnswer(p, opt)}
                        disabled={!!answered[p.id]}
                        className={`py-5 px-6 rounded-xl border transition-all duration-300 backdrop-blur-md text-lg flex items-center justify-center space-x-2 ${btnClass} disabled:cursor-not-allowed`}
                      >
                        <span>{opt}</span>
                        {isSelected && (isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
