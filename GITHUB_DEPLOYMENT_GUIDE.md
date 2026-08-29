# 🚀 Step-by-Step GitHub Pages Deployment Guide

Follow this guide to deploy your **AttendEase Mobile Attendance App** to GitHub Pages for free. Anyone in the world will be able to open your link and use the app on mobile or desktop!

---

## 🌟 Method 1: Web Upload via Browser (Easiest & Fastest - No Coding Needed)

### Step 1: Create a New GitHub Repository
1. Go to [github.com](https://github.com) and log in (or create a free account).
2. Click the **`+`** icon at the top right and select **"New repository"**.
3. Set **Repository name** to: `mobile-attendance-app` (or any name you like).
4. Make sure it is set to **Public**.
5. Check the box **"Add a README file"**.
6. Click the green button **"Create repository"**.

---

### Step 2: Upload Your App Files
1. Inside your new GitHub repository, click **"Add file"** $\rightarrow$ select **"Upload files"**.
2. Open your local project folder:
   ```
   C:\Users\Vishal Yaduvansi\.gemini\antigravity\scratch\mobile-attendance-app
   ```
3. Drag and drop all the files & folders into the GitHub upload area:
   - `index.html`
   - `css/` (containing `app.css`)
   - `js/` (containing `app.js` and `store.js`)
   - `manifest.json`
   - `sw.js`
4. Scroll down and click **"Commit changes"**.

---

### Step 3: Enable GitHub Pages (To get your live link)
1. In your GitHub repository, click on the **"Settings"** tab (at the top menu).
2. On the left sidebar, click on **"Pages"** (under Code and automation).
3. Under **"Build and deployment"** > **"Branch"**:
   - Change `None` to **`main`** (or `master`).
   - Leave the folder as **`/ (root)`**.
4. Click **"Save"**.

---

### Step 4: Your Live URL is Ready! 🎉
- Wait 30–60 seconds for GitHub to build the site.
- Refresh the **Pages** settings screen. You will see a banner:
  > **"Your site is live at https://<your-username>.github.io/mobile-attendance-app/"**
- Click the link to open your live application!

---

## 📲 How Anyone Can Use it as a Mobile App (PWA)

Once your GitHub Pages link is live:
1. **On iPhone (Safari)**:
   - Open your GitHub Pages URL in Safari.
   - Tap the **Share** button (box with an arrow pointing up).
   - Tap **"Add to Home Screen"**.
2. **On Android (Chrome)**:
   - Open your GitHub Pages URL in Chrome.
   - Tap the **3 dots** menu at top right (or the in-app **"Install Mobile App"** button).
   - Tap **"Install app"** or **"Add to Home Screen"**.

Now you and your team have a full mobile attendance app with offline caching and 3D UI on your phones!
