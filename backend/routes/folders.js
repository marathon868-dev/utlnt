const express = require('express');
const router = express.Router();
const { allQuery, runQuery, getQuery } = require('../database/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');

// Создаем папку для загрузок
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка multer с поддержкой UTF-8
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя для хранения на диске (только латиница)
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

// Функция для правильного декодирования имени файла
function decodeFileName(originalName) {
  try {
    // Пробуем декодировать как UTF-8
    const utf8Name = decodeURIComponent(escape(originalName));
    return utf8Name;
  } catch (e) {
    try {
      // Если не получилось, пробуем как latin1
      const latin1Name = iconv.decode(Buffer.from(originalName, 'binary'), 'win1251');
      return latin1Name;
    } catch (e2) {
      // Если ничего не помогло, возвращаем как есть
      return originalName;
    }
  }
}

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// ============ РАБОТА С ПАПКАМИ ============

router.get('/', async (req, res) => {
  try {
    const folders = await allQuery('SELECT * FROM folders ORDER BY created_at ASC');
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Folder name is required' });
  }
  try {
    const result = await runQuery('INSERT INTO folders (name) VALUES (?)', [name.trim()]);
    const newFolder = await getQuery('SELECT * FROM folders WHERE id = ?', [result.lastID]);
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Folder name is required' });
  }
  try {
    await runQuery(
      'UPDATE folders SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name.trim(), id]
    );
    const updatedFolder = await getQuery('SELECT * FROM folders WHERE id = ?', [id]);
    if (!updatedFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json(updatedFolder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const files = await allQuery('SELECT path FROM files WHERE folder_id = ?', [id]);
    
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    const result = await runQuery('DELETE FROM folders WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json({ message: 'Folder deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ РАБОТА С ФАЙЛАМИ ============

router.get('/:folderId/files', async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await getQuery('SELECT id FROM folders WHERE id = ?', [folderId]);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const files = await allQuery(
      'SELECT * FROM files WHERE folder_id = ? ORDER BY created_at DESC',
      [folderId]
    );
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Загрузка файла с правильной кодировкой
router.post('/:folderId/files', upload.single('file'), async (req, res) => {
  const { folderId } = req.params;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const folder = await getQuery('SELECT id FROM folders WHERE id = ?', [folderId]);
    if (!folder) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Правильно декодируем имя файла
    const originalName = decodeFileName(file.originalname);
    console.log('Original name:', file.originalname);
    console.log('Decoded name:', originalName);

    const result = await runQuery(
      `INSERT INTO files (folder_id, name, original_name, path, size, mime_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        folderId, 
        file.filename, 
        originalName, 
        file.path, 
        file.size, 
        file.mimetype
      ]
    );
    
    const newFile = await getQuery('SELECT * FROM files WHERE id = ?', [result.lastID]);
    res.status(201).json(newFile);
  } catch (err) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    res.status(500).json({ error: err.message });
  }
});

// Удалить файл
router.delete('/:folderId/files/:fileId', async (req, res) => {
  const { folderId, fileId } = req.params;
  try {
    const file = await getQuery('SELECT * FROM files WHERE id = ? AND folder_id = ?', [fileId, folderId]);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await runQuery('DELETE FROM files WHERE id = ? AND folder_id = ?', [fileId, folderId]);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Скачать файл с правильной кодировкой
router.get('/:folderId/files/:fileId/download', async (req, res) => {
  const { folderId, fileId } = req.params;
  try {
    const file = await getQuery('SELECT * FROM files WHERE id = ? AND folder_id = ?', [fileId, folderId]);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // Определяем MIME тип
    let mimeType = file.mime_type || 'application/octet-stream';
    
    // Если MIME тип не определен, пытаемся определить по расширению
    if (!file.mime_type || file.mime_type === 'application/octet-stream') {
      const ext = path.extname(file.original_name).toLowerCase();
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.7z': 'application/x-7z-compressed',
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
      };
      if (mimeTypes[ext]) {
        mimeType = mimeTypes[ext];
      }
    }

    // Кодируем имя файла для заголовка Content-Disposition
    // Используем RFC 5987 для правильной передачи UTF-8 имен
    const encodedName = encodeURIComponent(file.original_name);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`);
    res.setHeader('Content-Length', file.size);
    
    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
    
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;