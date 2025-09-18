# Productivity Gamified App

A gamified productivity mobile app built with **React Native** and **Firebase**. The app helps users manage tasks, track productivity, and stay motivated through achievements, streaks, and gamification mechanics.

## Implemented Features

- **Task Management:** Users can create, edit, delete, and mark tasks as completed. Tasks are synced in real-time with Firebase Firestore.
- **Gamification Mechanics:** 
  - XP and coin system based on task completion and streaks.
  - Achievements unlocked for milestones (e.g., completing 10 tasks in a row).
- **Friends System:** Users can add friends, accept/reject friend requests, and compare progress.
- **Leaderboard:** Global and friends-only leaderboard showing top users by XP.
- **Virtual Shop:** Users can spend coins to unlock skins and other cosmetic items.
- **Statistics & Charts:** Interactive charts display daily/weekly/monthly productivity.
- **Notifications:** Push notifications remind users of pending tasks and streaks.
- **UI/UX:** Custom animations for streaks, task completion, and achievement unlocks.
- **Cloud Integration:** Firebase Authentication for login/signup and Firestore for real-time data storage.

## Screenshots

- **Home / Task List:** Screenshot or GIF showing task creation and completion.
- **Achievements:** Screenshot of unlocked achievements.
- **Friends / Leaderboard:** Screenshot showing friends and global leaderboard.
- **Virtual Shop:** Screenshot showing skins or items users can buy with coins.


## Tech Stack

- **Frontend:** React Native with Expo
- **Backend & Cloud:** Firebase (Authentication, Firestore, Storage)
- **State Management:** React Context / Redux (optional)
- **Charts:** `react-native-chart-kit`
- **Navigation:** `expo-router`

## Setup

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/Ioana-Maraloi/myForest.git
cd myForest
```

### 2. Install dependencies

```bash
npm install
```

### 2. Run the app
```bash
npx expo start
```
