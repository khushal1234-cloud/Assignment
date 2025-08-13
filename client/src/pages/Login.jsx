import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [inputName, setInputName] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) onLogin(inputName.trim());
  };

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1 className="login-title">Sign in</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}
