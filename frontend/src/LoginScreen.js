import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './LoginScreen.css';

const API_URL = 'http://localhost:5000/api';

export default function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const canvasRef = useRef(null);

  // Анимация загрузки
  useEffect(() => {
    const duration = 3000;
    const interval = 50;
    let currentProgress = 0;
    
    const timer = setInterval(() => {
      currentProgress += (interval / duration) * 100;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
      setProgress(Math.min(currentProgress, 100));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Анимация фона с круглешками
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let circles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Circle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 200 + Math.random() * 400;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.04 + Math.random() * 0.06;
        this.blur = 80 + Math.random() * 100;
        const hues = [210, 215, 220, 225, 230];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -this.radius || this.x > canvas.width + this.radius) {
          this.speedX *= -1;
        }
        if (this.y < -this.radius || this.y > canvas.height + this.radius) {
          this.speedY *= -1;
        }
      }

      draw(ctx) {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `rgba(${this.hue}, 130, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(${this.hue}, 110, 255, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(${this.hue}, 90, 255, 0)`);

        ctx.save();
        ctx.shadowColor = `rgba(${this.hue}, 130, 255, 0.1)`;
        ctx.shadowBlur = this.blur;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const numCircles = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numCircles; i++) {
      circles.push(new Circle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Обработка входа
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isAuthenticating) return;

    setError('');
    setIsAuthenticating(true);

    try {
      console.log('========================================');
      console.log('Sending password to server...');
      console.log('Password:', password);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        password: password
      });

      console.log('Server response:', response.data);

      if (response.data.success) {
        console.log('✅ Login successful!');
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        setTimeout(() => {
          onLogin();
        }, 300);
      } else {
        console.log('❌ Login failed:', response.data.error);
        setError(response.data.error || 'Неверный пароль');
        setPassword('');
        setIsAuthenticating(false);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      if (err.response) {
        console.log('Server response:', err.response.data);
        if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Неверный пароль');
        }
      } else if (err.request) {
        console.log('No response from server');
        setError('Сервер не отвечает. Убедитесь, что backend запущен.');
      } else {
        setError('Ошибка подключения к серверу');
      }
      setIsAuthenticating(false);
    }
    console.log('========================================');
  };

  return (
    <div className="login-screen">
      <canvas ref={canvasRef} className="login-canvas" />
      
      <div className="login-content">
        <div className="login-container">
          <h1 className="login-title">УНИВЕРСИТЕТ ТАЛАНТОВ</h1>
          
          {loading ? (
            <div className="loading-wrapper">
              <div className="loading-bar-container">
                <div 
                  className="loading-bar" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="loading-percent">{Math.round(progress)}%</div>
            </div>
          ) : (
            <div className="login-wrapper">
              <p className="login-subtitle">Введите пароль для доступа к архиву</p>
              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Введите пароль"
                    className={`login-input ${error ? 'error' : ''}`}
                    disabled={isAuthenticating}
                    autoFocus
                  />
                  {error && <div className="login-error">{error}</div>}
                </div>
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isAuthenticating || !password}
                >
                  {isAuthenticating ? 'Проверка...' : 'Войти'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}