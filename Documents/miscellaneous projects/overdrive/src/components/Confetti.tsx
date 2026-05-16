"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<{ id: number; x: number; color: string }[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ top: "-10%", left: `${p.x}%`, opacity: 1, scale: 0 }}
          animate={{
            top: "110%",
            left: `${p.x + (Math.random() * 20 - 10)}%`,
            opacity: 0,
            scale: Math.random() * 1.5 + 0.5,
            rotate: Math.random() * 360
          }}
          transition={{
            duration: Math.random() * 2 + 1.5,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: "12px",
            height: "12px",
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px"
          }}
        />
      ))}
      <motion.div 
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-amber-600 text-white font-bold px-8 py-4 rounded-full shadow-2xl text-4xl whitespace-nowrap"
      >
        🔥 STREAK x2 MULTIPLIER! 🔥
      </motion.div>
    </div>
  );
}
