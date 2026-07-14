import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DarkVeil from './DarkVeil';
import FolderGrid from './FolderGrid';
import FolderModal from './FolderModal';
import LoginScreen from './LoginScreen';

// Используем переменную окружения для API URL
const API_URL = process.env.REACT_APP_API_URL || '/api';

console.log('API_URL:', API_URL);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderFiles, setFolderFiles] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchFolders = async () => {
    try {
      console.log('Fetching folders from:', `${API_URL}/folders`);
      const response = await axios.get(`${API_URL}/folders`);
      console.log('Folders loaded:', response.data);
      setFolders(response.data);
      setLoading(false);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError('Не удалось загрузить папки. Убедитесь, что backend запущен.');
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFolders();
    }
  }, [isAuthenticated]);


  // Загрузка файлов папки
  const loadFolderFiles = async (folderId) => {
    try {
      console.log('Loading files for folder:', folderId);
      const response = await axios.get(`${API_URL}/folders/${folderId}/files`);
      console.log('Files loaded:', response.data);
      setFolderFiles(prev => ({
        ...prev,
        [folderId]: response.data
      }));
    } catch (err) {
      console.error('Error loading files:', err);
      setFolderFiles(prev => ({
        ...prev,
        [folderId]: []
      }));
    }
  };

  // Открытие папки
  const openFolder = async (folder) => {
    console.log('Opening folder:', folder);
    setSelectedFolder(folder);
    if (!folderFiles[folder.id]) {
      await loadFolderFiles(folder.id);
    }
  };

  // Закрытие папки
  const closeFolder = () => {
    console.log('Closing folder');
    setSelectedFolder(null);
  };

  // Добавление папки
  const addFolder = async () => {
    try {
      const newFolderName = `Новая папка ${folders.length + 1}`;
      console.log('Adding folder:', newFolderName);
      const response = await axios.post(`${API_URL}/folders`, { name: newFolderName });
      console.log('Folder added:', response.data);
      
      const newFolder = { ...response.data, isAdding: true };
      setFolders(prev => [...prev, newFolder]);
      
      setTimeout(() => {
        setFolders(prev => prev.map(f => 
          f.id === newFolder.id ? { ...f, isAdding: false } : f
        ));
      }, 600);
      
    } catch (err) {
      console.error('Error adding folder:', err);
      alert('Не удалось создать папку');
    }
  };

  // Обновление названия
  const updateFolder = async (id, newName) => {
    try {
      console.log('Updating folder:', id, newName);
      const response = await axios.put(`${API_URL}/folders/${id}`, { name: newName });
      console.log('Folder updated:', response.data);
      setFolders(prev => prev.map(f => f.id === id ? response.data : f));
    } catch (err) {
      console.error('Error updating folder:', err);
      alert('Не удалось обновить название');
    }
  };

  // Удаление папки
  const deleteFolder = async (id) => {
    console.log('Deleting folder:', id);
    
    setFolders(prev => prev.map(f => 
      f.id === id ? { ...f, isRemoving: true } : f
    ));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await axios.delete(`${API_URL}/folders/${id}`);
      console.log('Folder deleted from DB:', id);
      
      setFolders(prev => {
        const newFolders = prev.filter(f => f.id !== id);
        console.log('Folders after deletion:', newFolders);
        return newFolders;
      });
      
      setFolderFiles(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      
      if (selectedFolder && selectedFolder.id === id) {
        setSelectedFolder(null);
      }
      
    } catch (err) {
      console.error('Error deleting folder:', err);
      alert('Не удалось удалить папку');
      setFolders(prev => prev.map(f => 
        f.id === id ? { ...f, isRemoving: false } : f
      ));
    }
  };

  // Добавление файла
  const addFile = async (folderId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      console.log('Adding file:', file.name, 'to folder:', folderId);
      const response = await axios.post(`${API_URL}/folders/${folderId}/files`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File added:', response.data);
      
      setFolderFiles(prev => ({
        ...prev,
        [folderId]: [...(prev[folderId] || []), response.data]
      }));
    } catch (err) {
      console.error('Error adding file:', err);
      alert('Не удалось загрузить файл');
    }
  };

  // Удаление файла
  const deleteFile = async (folderId, fileId) => {
    try {
      console.log('Deleting file:', fileId, 'from folder:', folderId);
      await axios.delete(`${API_URL}/folders/${folderId}/files/${fileId}`);
      console.log('File deleted:', fileId);
      
      setFolderFiles(prev => ({
        ...prev,
        [folderId]: prev[folderId].filter(f => f.id !== fileId)
      }));
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Не удалось удалить файл');
    }
  };

  // Если не авторизован - показываем экран входа
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="app">
        <div className="veil-wrapper">
          <DarkVeil
            hueShift={10}
            noiseIntensity={0.03}
            scanlineIntensity={0.08}
            speed={0.4}
            scanlineFrequency={400}
            warpAmount={0.15}
          />
        </div>
        <div className="content">
          <div className="header">
            <h1>Университет Талантов</h1>
            <h2>Архив</h2>
          </div>
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="veil-wrapper">
        <DarkVeil
          hueShift={10}
          noiseIntensity={0.03}
          scanlineIntensity={0.08}
          speed={0.4}
          scanlineFrequency={400}
          warpAmount={0.15}
        />
      </div>
      <div className="content">
        <div className="header">
          <h1>УНИВЕРСИТЕТ ТАЛАНТОВ</h1>
          <h2>Архив</h2>
        </div>
        <FolderGrid
          folders={folders}
          onAddFolder={addFolder}
          onUpdateFolder={updateFolder}
          onDeleteFolder={deleteFolder}
          onOpenFolder={openFolder}
        />
        {error && <div className="error">{error}</div>}
      </div>

      <FolderModal
        folder={selectedFolder}
        files={selectedFolder ? folderFiles[selectedFolder.id] || [] : []}
        onClose={closeFolder}
        onAddFile={addFile}
        onDeleteFile={deleteFile}
        onDeleteFolder={deleteFolder}
      />
    </div>
  );
}

export default App;