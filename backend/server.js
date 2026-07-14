const express = require('express');
const cors = require('./middleware/cors');
const foldersRouter = require('./routes/folders');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/folders', foldersRouter);

// Эндпоинт для проверки пароля (упрощенный)
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  
  console.log('========================================');
  console.log('LOGIN ATTEMPT:');
  console.log('Received password:', password);
  console.log('Password length:', password ? password.length : 0);
  
  if (!password) {
    console.log('ERROR: No password provided');
    return res.status(400).json({ success: false, error: 'Password is required' });
  }

  // Проверка пароля (прямое сравнение для простоты)
  const CORRECT_PASSWORD = 'utalents123';
  
  if (password === CORRECT_PASSWORD) {
    console.log('✅ PASSWORD CORRECT!');
    // Генерируем простой токен
    const token = Buffer.from(Date.now().toString()).toString('base64');
    res.json({ 
      success: true, 
      token: token,
      message: 'Login successful' 
    });
  } else {
    console.log('❌ PASSWORD INCORRECT!');
    console.log('Expected:', CORRECT_PASSWORD);
    console.log('Received:', password);
    res.status(401).json({ 
      success: false, 
      error: 'Неверный пароль' 
    });
  }
  console.log('========================================');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  Backend сервер запущен!');
  console.log(`  Порт: ${PORT}`);
  console.log(`  API: http://localhost:${PORT}/api`);
  console.log('========================================');
  console.log('  Доступные эндпоинты:');
  console.log(`  POST   /api/auth/login       - проверка пароля`);
  console.log(`  GET    /api/folders          - получить все папки`);
  console.log('========================================');
  console.log('  Пароль для входа: utalents123');
  console.log('========================================');
});