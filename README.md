# Productivity Gamified App

A gamified productivity mobile app built with **React Native** and **Firebase**. The app helps users manage tasks, track productivity, and stay motivated through achievements, streaks, and gamification mechanics.

## Implemented Features

- **Task Management:** Users can create, edit, delete, and mark tasks as completed. Tasks are synced in real-time with Firebase Firestore.
- **Gamification Mechanics:** 
  - XP and coin system based on task completion and streaks.
  - Achievements unlocked for milestones (e.g., completing 10 tasks in a row).
- **Friends System:** Users can add friends, accept/reject friend requests, and compare progress.
- **Virtual Shop:** Users can spend coins to unlock skins and other cosmetic items.
- **Statistics & Charts:** Interactive charts display daily/weekly/monthly productivity.
- **UI/UX:** Custom animations for streaks, task completion, and achievement unlocks.
- **Cloud Integration:** Firebase Authentication for login/signup and Firestore for real-time data storage.

## Screenshots
- **Login:**
 <img src="https://github.com/user-attachments/assets/7082eb72-bdfb-4c3f-8216-1927da81a4bd" width="300"/>



- **Task List:**
 <img src = "https://github.com/user-attachments/assets/b00397af-896d-4fc0-afb5-b1a7697c4720" width="300"/>

- **Achievements:**
<img src = "https://github.com/user-attachments/assets/c7c8ea2a-7e70-4c4d-b9bd-e1b7a84aafa3" width = "300"/>

- **Friends:** 
- **Virtual Shop:**
<img src = "https://github.com/user-attachments/assets/a2ad0b9c-bd53-4a4b-b3fd-b4aa725feea6" width = "300" />



## Tech Stack

- **Frontend:** React Native with Expo
- **Backend & Cloud:** Firebase (Authentication, Firestore)
- **State Management:** React Context 
- **Charts:** `react-native-chart-kit`
- **Navigation:** `expo-router`

## Setup

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/Ioana-Maraloi/everGrow.git
cd everGrow
```

### 2. Install dependencies

```bash
npm install
```

### 2. Run the app
```bash
npx expo start
```