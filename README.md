# Tasky v2

Tasky v2 is a **modern task management web app** built with **React**, **Firebase**, and **Drag-and-Drop** functionality powered by **dnd-kit**. It features an intuitive UI, responsive design, and seamless real-time updates.

---

## 🚀 Tech Stack

- **React 19** – Frontend library for building interactive UIs
- **Vite** – Lightning-fast bundler and development server
- **TypeScript** – Type safety and better developer experience
- **TailwindCSS 4** – Utility-first CSS framework for rapid styling
- **Firebase** – Authentication, Firestore database, and hosting
- **dnd-kit** – Drag-and-drop library for reordering and organizing tasks
- **React Router v7** – Client-side routing for smooth navigation

---

## ✨ Features

- 🔐 **Firebase Auth** – Secure email/password or social login
- 📋 **Task Management** – Create, edit, and delete tasks easily
- 🔄 **Drag-and-Drop** – Organize tasks and columns intuitively
- 🗂️ **Multiple boards** - For project organization
- ☁️ **Cloud Sync** – Real-time syncing with Firestore
- 🤝 **Realtime Collaboration** – Multiple users can edit and view updates instantly
- 📱 **Responsive Design** – Optimized for mobile and desktop devices

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/tasky-v2.git
cd tasky-v2
```
### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up Firebase

Create a .env file in the project root and add your Firebase configuration:
```dotenv
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
### 4️⃣ Start the development server
```bash
npm run dev
```   
---
## 📦 Build for Production
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

