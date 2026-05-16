"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, Zap, Trophy, Target, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    title: "Secure Access",
    desc: "Connect your Google account to track your global rank, unlock rewards, and save your progress.",
    icon: <ShieldCheck className="w-12 h-12 text-blue-400" />,
    color: "from-blue-500/20 to-blue-600/20"
  },
  {
    title: "Pick Your Side",
    desc: "Select your favorite IPL team to instantly inject their colors into the entire application theme.",
    icon: <Target className="w-12 h-12 text-yellow-400" />,
    color: "from-yellow-500/20 to-yellow-600/20"
  },
  {
    title: "Real-Time Action",
    desc: "Answer micro-prediction questions as they happen live. Every ball matters, every over is a chance to win.",
    icon: <Zap className="w-12 h-12 text-purple-400" />,
    color: "from-purple-500/20 to-purple-600/20"
  },
  {
    title: "OverDrive Mode",
    desc: "Hit a streak of 3 correct answers to trigger a 2x point multiplier and activate visual effects.",
    icon: <Trophy className="w-12 h-12 text-orange-400" />,
    color: "from-orange-500/20 to-orange-600/20"
  }
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className={`p-8 bg-gradient-to-br ${STEPS[currentStep].color} transition-colors duration-500`}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-1">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-white" : "w-2 bg-white/20"}`} 
                />
              ))}
            </div>
            <button onClick={onComplete} className="text-white/40 hover:text-white text-sm">Skip</button>
          </div>

          <div className="flex flex-col items-center text-center">
            <motion.div
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-6"
            >
              {STEPS[currentStep].icon}
            </motion.div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-gray-300 leading-relaxed min-h-[80px]">
              {STEPS[currentStep].desc}
            </p>
          </div>
        </div>

        <div className="p-6 bg-black/40 flex justify-between items-center">
          <button
            onClick={prev}
            className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-widest ${currentStep === 0 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-white"}`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={next}
            className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform"
          >
            <span>{currentStep === STEPS.length - 1 ? "Get Started" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
