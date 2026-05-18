"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { LiveDashboard } from "@/components/LiveDashboard";
import { Onboarding } from "@/components/Onboarding";
import { Zap, LogIn, AlertCircle, Copy, Check, ExternalLink, X } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, User } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";

const TEAMS = [
  { name: "Chennai Super Kings", color: "#eab308", rgb: "234, 179, 8" },
  { name: "Mumbai Indians", color: "#3b82f6", rgb: "59, 130, 246" },
  { name: "Royal Challengers Bangalore", color: "#ef4444", rgb: "239, 68, 68" },
  { name: "Kolkata Knight Riders", color: "#a855f7", rgb: "168, 85, 247" },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [favoriteTeam, setFavoriteTeam] = useState(TEAMS[1]); // Default MI

  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("overdrive-guide-seen");
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  const completeGuide = () => {
    setShowGuide(false);
    localStorage.setItem("overdrive-guide-seen", "true");
  };

  const [authError, setAuthError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Apply dynamic theme based on favorite team
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", favoriteTeam.color);
    document.documentElement.style.setProperty("--primary-rgb", favoriteTeam.rgb);
  }, [favoriteTeam]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Sign-in failed", error);
      if (error.code === "auth/unauthorized-domain") {
        setAuthError("unauthorized-domain");
      } else {
        setAuthError(error.message || "An unexpected sign-in error occurred.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Sign-out failed", error);
    }
  };

  return (
    <main className="min-h-screen pb-12 relative overflow-hidden">
      <AnimatePresence>
        {showGuide && <Onboarding onComplete={completeGuide} />}
      </AnimatePresence>

      {/* Auth Error Modal */}
      <AnimatePresence>
        {authError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-lg w-full bg-[#1e293b]/90 border border-red-500/30 rounded-3xl p-8 relative shadow-2xl glass"
            >
              <button 
                onClick={() => setAuthError(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-3 text-red-400 mb-6">
                <AlertCircle className="w-8 h-8" />
                <h3 className="text-2xl font-black uppercase tracking-tight italic">Domain Unauthorized</h3>
              </div>

              {authError === "unauthorized-domain" ? (
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Firebase Authentication blocks Google Sign-In on new domains until they are explicitly authorized.
                  </p>
                  
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 1: Copy this domain</p>
                    <div className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                      <code className="text-xs text-blue-400 font-mono select-all">
                        overdrive-ipl-155191315903.us-central1.run.app
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("overdrive-ipl-155191315903.us-central1.run.app");
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1 text-xs shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 2: Add in Firebase</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Go to <span className="text-white font-semibold">Firebase Console</span> &gt; <span className="text-white font-semibold">Authentication</span> &gt; <span className="text-white font-semibold">Settings</span> &gt; <span className="text-white font-semibold">Authorized domains</span> tab, and add this domain to the list.
                    </p>
                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--primary)] hover:underline mt-1"
                    >
                      <span>Open Firebase Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm">{authError}</p>
              )}

              <button
                onClick={() => setAuthError(null)}
                className="mt-6 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl border border-white/10 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="w-full p-4 glass sticky top-0 z-40 border-b-0 border-x-0 rounded-none rounded-b-2xl mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-[var(--primary)] fill-current" />
            <span className="text-2xl font-black tracking-tight uppercase italic">OverDrive</span>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setShowGuide(true)}
              className="hidden sm:block text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--primary)] transition-colors"
            >
              How to Play
            </button>
            <div className="hidden md:flex space-x-2">
              {TEAMS.map((team) => (
                <button
                  key={team.name}
                  onClick={() => setFavoriteTeam(team)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    favoriteTeam.name === team.name ? "scale-125 border-white" : "border-transparent opacity-50"
                  }`}
                  style={{ backgroundColor: team.color }}
                  title={`Set ${team.name} as favorite`}
                />
              ))}
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img src={user.photoURL || ""} alt="Avatar" className="w-8 h-8 rounded-full ring-2 ring-[var(--primary)]" />
                  <span className="text-sm font-medium hidden sm:block text-gray-200">{user.displayName}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-2 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white px-4 py-2 rounded-full font-bold transition-colors shadow-lg shadow-[var(--primary)]/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="p-6 bg-[var(--primary)]/20 rounded-full blur-2xl absolute w-64 h-64 -z-10 animate-pulse" />
            <Zap className="w-24 h-24 text-[var(--primary)] mb-4" />
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
              Support <span className="text-[var(--primary)]">{favoriteTeam.name.split(' ').pop()}</span> <br />
              & Win Big
            </h1>
            <p className="text-xl text-gray-400 max-w-xl">
              Real-time micro-predictions for the IPL season. Build momentum, climb the leaderboard, and unlock rewards.
            </p>
            <button
              onClick={handleSignIn}
              className="mt-8 bg-gradient-to-r from-[var(--primary)] to-purple-600 px-8 py-4 rounded-full text-lg font-bold text-white hover:scale-105 transition-transform shadow-2xl flex items-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Connect & Play</span>
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <LiveDashboard userId={user.uid} favoriteTeam={favoriteTeam} />
          </div>
        )}
      </div>

      {/* Background visual elements */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />
      </div>
    </main>
  );
}
