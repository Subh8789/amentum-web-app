"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../utils/Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const router =  useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', { email, password, rememberMe });
    router.push("/dropoff")
  };

  return (
    <div className="login-container">
      {/* Background Image */}
      <div className="background-image">
        <div className="background-overlay" />
      </div>

      {/* Login Form Card */}
      <div className="login-form-card">
        {/* Logo */}
        {/* <div className="logo-container">
          <div className="logo">
            <span className="logo-text">S</span>
          </div>
        </div> */}

        <h2 className="form-title">
          Amentum Ois Web Solution
        </h2>
        <p className="form-subtitle">
          Please provide your login details below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
             
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
             
            />
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="remember-checkbox"
            />
            <label className="remember-text">Remember Me</label>
          </div>

          <div className="button-container">
            <button type="submit" className="login-button">
              LOGIN
            </button>
            
            <div className="forgot-password">
              <a href="#" className="forgot-link">
                Forgot Password?
                <span className="reset-text">Click here to reset</span>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;