const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../archive.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

function initDatabase() {
  // Таблица папок
  db.run(`
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating folders table:', err.message);
    } else {
      console.log('Folders table ready');
      // Добавляем начальные папки если таблица пуста
      db.get('SELECT COUNT(*) as count FROM folders', (err, row) => {
        if (err) return;
        if (row.count === 0) {
          const initialFolders = ['Проекты', 'Договоры', 'Отчёты', 'Презентации'];
          const stmt = db.prepare('INSERT INTO folders (name) VALUES (?)');
          initialFolders.forEach(name => stmt.run(name));
          stmt.finalize();
          console.log('Initial folders added');
        }
      });
    }
  });

  // Таблица файлов (НОВАЯ)
  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      path TEXT NOT NULL,
      size INTEGER NOT NULL,
      mime_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating files table:', err.message);
    } else {
      console.log('Files table ready');
      
      // Создаем индексы для ускорения
      db.run('CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at)');
    }
  });
}

// Промис-обертка для db.run
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Промис-обертка для db.get
function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Промис-обертка для db.all
function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery
};