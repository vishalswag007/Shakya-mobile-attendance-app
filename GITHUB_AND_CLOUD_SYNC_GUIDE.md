# 📱 GitHub Pages Deployment & Multi-Phone Cloud Access Guide

This attendance web application is 100% static (HTML5, Modern CSS3, Vanilla JS) and **optimized to run free on GitHub Pages** so it can be accessed from any Android phone, iPhone, tablet, or laptop in the world.

---

## 🚀 Part 1: How to Deploy to GitHub Pages (Free Hosting)

1. **Create a GitHub Repository**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g. `apex-attendance-app`).
   - Choose **Public** and click **Create repository**.

2. **Upload All Files**:
   - Upload the project files (`index.html`, `css/app.css`, `js/store.js`, `js/app.js`).
   - Or push from your terminal:
     ```bash
     git init
     git add .
     git commit -m "Deploy Apex Coaching Attendance App with 3D UI & Cloud Sync"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/apex-attendance-app.git
     git push -u origin main
     ```

3. **Enable GitHub Pages**:
   - Go to your repository **Settings** $\rightarrow$ **Pages** (in left sidebar).
   - Under **Build and deployment** $\rightarrow$ **Branch**, select `main` and `/ (root)`.
   - Click **Save**.
   - Your live website link will be:  
     👉 `https://YOUR_USERNAME.github.io/apex-attendance-app/`

---

## ☁️ Part 2: How Multi-Phone Cloud Sync Works

Because standard browser storage (`localStorage`) is saved only inside the individual phone:
We built a **Cloud Real-Time Sync Engine** directly into the **Settings** tab so that any teacher or admin can access and update attendance from any phone:

### Option A: Free Firebase Realtime Database (Recommended - 2 min setup)
1. Go to [firebase.google.com](https://firebase.google.com/) and create a free project.
2. In the left menu, click **Build** $\rightarrow$ **Realtime Database** $\rightarrow$ **Create Database** (Start in Test Mode).
3. Copy your database URL, adding `/attendance.json` at the end:
   `https://YOUR-PROJECT-NAME-default-rtdb.firebaseio.com/attendance.json`
4. Open your App $\rightarrow$ Go to **⚙️ Settings** $\rightarrow$ Paste this URL in **Firebase / JSON Cloud Sync URL** $\rightarrow$ Click **Save & Sync Now**.
5. **Done!** Now, whenever attendance is marked on Phone 1, Phone 2 will automatically sync in real-time!

### Option B: 1-Click WhatsApp Attendance Sharing (Instant - No Setup)
- Click the green **💬 WhatsApp** button on the top header or Date-wise Reports tab.
- Automatically generates a formatted report:
  ```
  🎓 *Apex Coaching Institute*
  📅 *Date:* 2026-08-30
  📊 *Summary:* Total: 6 | Present: 4 ✅ | Absent: 1 ❌ | Leave: 1 ⏳
  📈 *Attendance Rate:* 67%
  --------------------------------
  ❌ *ABSENT STUDENTS (1):*
  • *Roll 104*: Rohan Mehta (S/o Dinesh Mehta) - JEE Mains & Advanced
  ```
- Send directly to parents or the coaching staff WhatsApp group in 1 tap!

### Option C: 1-Click Offline Backup (.JSON)
- Go to **⚙️ Settings** $\rightarrow$ Tap **Export JSON**.
- Save the backup file to Google Drive, WhatsApp, or email.
- Tap **Import JSON** on any new phone to restore all students, father names, and records instantly.
