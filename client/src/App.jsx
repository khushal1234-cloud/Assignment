import React, { useState } from "react";
import Login from "./pages/Login";
import Content from "./pages/Content";
import "./index.css"; // make sure this import exists in main.jsx or here

export default function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Central clickstream logger (matches your backend's expected keys)
  const logEvent = async (eventType, extraData = "") => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username || "Guest",
          event_type: eventType,       // <- snake_case to match your DB
          details: extraData,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Error logging event:", err);
    }
  };

  const handleLogin = async (user) => {
    setUsername(user);
    await logEvent("login", "logged in successfully");
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    await logEvent("logout");
    setUsername("");
    setLoggedIn(false);
  };

  const handleVideoPlay = async (videoId) => {
    await logEvent("video_play", JSON.stringify({ video_id: videoId }));
  };

  return loggedIn ? (
    <Content username={username} onLogout={handleLogout} onVideoPlay={handleVideoPlay} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
