const express = require('express');
const cors = require('./middleware/cors');
const foldersRouter = require('./routes/folders');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (загрузки)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/folders', foldersRouter);

// Эндпоинт для проверки пароля
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ success: false, error: 'Password is required' });
  }

  const CORRECT_PASSWORD = 'utalents123';
  
  if (password === CORRECT_PASSWORD) {
    const token = Buffer.from(Date.now().toString()).toString('base64');
    res.json({ 
      success: true, 
      token: token,
      message: 'Login successful' 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Неверный пароль' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- РАЗДАЧА ФРОНТЕНДА ---

// Путь к папке с собранным фронтендом
const frontendBuildPath = path.join(__dirname, '../frontend/build');

// Проверяем, существует ли папка build
if (fs.existsSync(frontendBuildPath)) {
  console.log('✅ Frontend build found, serving static files...');
  
  // Раздаем статические файлы
  app.use(express.static(frontendBuildPath));
  
  // Все остальные запросы (кроме API) отдаем index.html
  app.get('*', (req, res) => {
    // Проверяем, что это не API запрос
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  console.log('⚠️ Frontend build not found. API only mode.');
  console.log(`Expected path: ${frontendBuildPath}`);
  
  // Если фронтенд не собран, отдаем простую страницу
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Archive API</title></head>
        <body>
          <h1>Archive API</h1>
          <p>Server is running. Frontend not built.</p>
          <p>Visit <a href="/api/health">/api/health</a> to check status.</p>
        </body>
      </html>
    `);
  });
}

// Запуск сервера
app.listen(PORT, () => {
  console.log('========================================');
  console.log('  Backend сервер запущен!');
  console.log(`  Порт: ${PORT}`);
  console.log(`  API: http://localhost:${PORT}/api`);
  console.log(`  Frontend: ${fs.existsSync(frontendBuildPath) ? '✅ Собран' : '❌ Не найден'}`);
  console.log('========================================');
  console.log('  Пароль для входа: utalents123');
  console.log('========================================');
});