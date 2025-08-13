# Video Event Logger

A simple React-based web app that allows users to log in, play videos, and automatically record user events (login, logout, and video plays) to a backend server.


## Features
- **User Login & Logout** with username input.
- **Three playable videos**.
- **Automatic event logging** for:
  - User login
  - User logout
  - Video play events
- **Backend event API integration**.


## Tech Stack
**Frontend:**
- React
- JavaScript (ES6+)
- CSS

**Backend (Required for event logging):**
- Node.js
- Express.js


## Project Structure
```
├── client
│   ├── dist
│   ├── index.html
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   |── vite.config.js
│   ├── src
|   ├── App.jsx
|   ├── index.css
|   ├── main.jsx
|   └── pages
|       ├── Content.jsx
|       └── Login.jsx
└── server
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    └── server.js

```


## Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/khushal1234-cloud/et617_assignment
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run the Backend Server
Make sure you have Node.js installed.  
This will start the backend API for event logging.

```bash
cd server
npx nodemon server.js
```
The backend will run on **http://localhost:5000**.

### 4️⃣ Run the Frontend
In another terminal:
```bash
cd client
npm run dev
```
The frontend will run on **http://localhost:5173**.



## API Endpoints
**POST** `/events`  
Logs an event to the backend.
```json
{
  "username": "JohnDoe",
  "event_type": "video_play",
  "details": "{video_id:video1}",
  "timestamp": "2025-08-13T12:00:00.000Z"
}
```



## Deployment
### **Frontend-only**
You can deploy the React build to:
- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)

### **Full-stack Deployment**
To keep event logging working online, deploy both frontend & backend:
- [Render](https://render.com)
- [Railway](https://railway.app)
- VPS (e.g., DigitalOcean, AWS EC2)

Build the React app before deployment:
```bash
npm run build
```