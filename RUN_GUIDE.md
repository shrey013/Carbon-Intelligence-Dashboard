# 🚀 RUN GUIDE — Carbon Intelligence Dashboard  

🔗 **Live Demo (Netlify):** https://luxury-sprinkles-9aa15b.netlify.app/ 
📦 **GitHub Repository:** https://github.com/shrey013/Carbon-Intelligence-Dashboard

### How to Download, Install, Run & Fix Errors (Beginner Friendly)

This guide explains **exactly how to run the full project** on any computer.

---

# 📌 1. Requirements (Install These First)

Before running the project, install:

### ✅ Node.js + npm
Download from: https://nodejs.org  
Install the **LTS version**.

Check installation:

```bash
node -v
npm -v
```

If both show versions (e.g., v18+), installation is fine.

### ✅ A Web Browser
Chrome / Edge / Firefox / Safari.

### (Optional but Recommended)  
### ✅ OpenAI API Key  
Needed for AI chatbot to work.

Get key from: https://platform.openai.com/

---

# 📁 2. Folder Structure (must look like this)

```
Emission-Dashboard/
│
├── README.md
├── RUN_GUIDE.md
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── node_modules/      (created after install)
│   └── src/
│       └── index.js
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

Do **not** move or rename folders.

---

# ⚙️ 3. How to Run the Project (Step-by-Step)

There are **two parts**:

### 1) Start the Backend  
### 2) Open the Frontend

Do them in this exact order.

---

# 🟦 Step 1 — Start the BACKEND

### 1. Open Terminal/Command Prompt  
Go to the backend folder:

```bash
cd path/to/Emission-Dashboard/backend
```

Example (Mac):

```bash
cd ~/Documents/Emission-Dashboard/backend
```

### 2. Install backend packages

```bash
npm install
```

This creates a `node_modules` folder.

### 3. Create `.env` file

Inside backend folder:

```
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
```

Replace the key.

Example:

```
OPENAI_API_KEY=sk-123abcXXXXXXXX
```

### 4. Start the backend server

```bash
npm start
```

You should see:

```
Server running on port 5000
```

### 5. Test backend in browser

Open:

```
http://localhost:5000/
```

You should see:

```
{ "status": "Backend running successfully 🚀" }
```

If you see this → backend is working.

⚠️ Keep this terminal window open.  
If you close it, backend stops.

---

# 🟩 Step 2 — Open the FRONTEND (Dashboard)

### Option A — Open directly
Go to:

```
Emission-Dashboard/frontend/index.html
```

Double-click → opens in browser.

### Option B — (Recommended) Use VS Code Live Server
1. Install **Live Server** extension (free).
2. Right-click `index.html`.
3. Click **Open With Live Server**.

It opens a URL like:

```
http://127.0.0.1:5500/frontend/index.html
```

Now your dashboard is fully working.

AI chat will call backend at:

```
http://localhost:5000/api/chat
```

---

# 🌍 4. (Optional) Deployment Guide  
Make your dashboard publicly accessible online.

### Deploy backend (Node)
Free platforms:

- Render.com (best)
- Railway.app

Steps:
1. Push entire project to GitHub.
2. Create new Web Service.
3. Select **backend/** as root folder.
4. Add environment variable:
   - `OPENAI_API_KEY`
5. Deploy.
6. Get backend URL like:
   `https://your-backend.onrender.com`

### Deploy frontend (HTML/CSS/JS)
Free platforms:

- Netlify (best)
- Vercel
- GitHub Pages

Steps:
1. Drag & drop the `frontend/` folder to Netlify.
2. Update this line in script.js:

```
const API_BASE_URL = "https://your-backend.onrender.com";
```

Your live site becomes accessible anywhere.

---

# 🔧 5. Troubleshooting (Common Errors)

---

## ❌ Error: “npm ERR! no such file or directory, open package.json”

Cause: You are in the wrong folder.

Fix:

```bash
cd path/to/Emission-Dashboard/backend
```

Then run:

```bash
npm install
npm start
```

---

## ❌ Error: “Backend not reachable…”

Cause: Backend is not running.

Fix:
1. Go to backend folder.
2. Run:

```bash
npm start
```

3. Test in browser:

```
http://localhost:5000/
```

---

## ❌ Error: “Something went wrong with GPT API”

Cause: Wrong or missing OpenAI key.

Fix:
1. Open `.env`
2. Ensure:

```
OPENAI_API_KEY=sk-xxxxxxxxxx
```
3. Restart backend:

```bash
Ctrl + C
npm start
```

---

## ❌ Frontend loads but AI chatbot doesn’t respond

Check in script.js:

```
const API_BASE_URL = "http://localhost:5000";
```

If deployed:

```
const API_BASE_URL = "https://your-backend.onrender.com";
```

---

## ❌ Style or UI broken

Ensure:

- `index.html`  
- `style.css`  
- `script.js`

are in the **same folder (`frontend/`)**.

---

# 👨‍💻 6. Developer Contact (For Judges)

If you face any issue, contact:

📨 **shreyanshsaurav0786@gmail.com**

I will respond immediately and resolve the issue.

---

# 🎉 7. You Are Done!

Now you know:

✔️ How to install Node  
✔️ How to run backend  
✔️ How to open frontend  
✔️ How to test  
✔️ How to deploy  
✔️ How to fix all common errors

The Carbon Intelligence Dashboard is ready to run anywhere.

