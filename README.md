# OverDrive 🏎️💨
### Real-time Gamified IPL Fan Engagement Platform

OverDrive is a full-stack, high-performance web application designed for IPL fans to engage with live matches through micro-predictions. Built with Next.js, Firebase, and Framer Motion, it offers a premium, real-time experience with dynamic scaling and visual rewards.

## 🚀 Live Demo
**[Live Application URL](https://overdrive-ipl-155191315903.us-central1.run.app)** 


## ✨ Key Features
- **Live Dashboard**: Real-time micro-prediction stream powered by Firestore.
- **Momentum Engine**: Hit a 3-prediction streak to activate **OverDrive Mode** (2x Point Multiplier + Visual Confetti).
- **Adaptive Difficulty**: Server-side logic that scales question difficulty based on user win-rate (>80% win rate triggers Elite Mode).
- **Dynamic Theming**: Select your favorite team to instantly update the entire app's color palette (CSK, MI, RCB, KKR).
- **Secure Authentication**: Google Sign-In via Firebase Auth.
- **Premium UI**: Built with Tailwind CSS and Framer Motion for glassmorphism effects and smooth transitions.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion
- **Backend/Database**: Firebase Firestore (Real-time), Firebase Auth
- **Deployment**: Google Cloud Run (Dockerized)

## 📦 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashiksharonm/overdrive-ipl.git
   cd overdrive
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Seed the database (Optional):**
   ```bash
   npx tsx scripts/seed.ts
   ```

## 🐳 Docker Deployment
The application is ready for Docker deployment on port 8080:
```bash
docker build -t overdrive-ipl .
docker run -p 8080:8080 overdrive-ipl
```

---
Built with 🔥 for the IPL Season.
