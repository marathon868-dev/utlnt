import React, { useState, useRef, useEffect } from 'react';
import { getFileIcon } from './FileIcons';

const API_URL = 'http://localhost:5000/api';

export default function FolderModal({ folder, files, onClose, onAddFile, onDeleteFile, onDeleteFolder }) {
  const [isDragging, setIsDragging] = useState(false);
  const [removingFileId, setRemovingFileId] = useState(null);
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log('FolderModal: folder changed', folder);
    console.log('FolderModal: files', files);
  }, [folder, files]);

  if (!folder) {
    return null;
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      onAddFile(folder.id, file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('File dropped:', file.name);
      onAddFile(folder.id, file);
    }
  };

  const handleDeleteFile = async (fileId) => {
    setRemovingFileId(fileId);
    await new Promise(resolve => setTimeout(resolve, 300));
    onDeleteFile(folder.id, fileId);
    setRemovingFileId(null);
  };

  const handleDownloadFile = async (fileId) => {
    try {
      setDownloadingFileId(fileId);
      console.log('Downloading file:', fileId);
      
      const downloadUrl = `${API_URL}/folders/${folder.id}/files/${fileId}/download`;
      window.open(downloadUrl, '_blank');
      
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Не удалось скачать файл');
    } finally {
      setTimeout(() => {
        setDownloadingFileId(null);
      }, 1000);
    }
  };

  const handleDeleteFolder = async () => {
    if (!window.confirm(`Удалить папку "${folder.name}" и все файлы в ней?`)) return;
    
    setIsDeletingFolder(true);
    try {
      await onDeleteFolder(folder.id);
      onClose();
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Не удалось удалить папку');
      setIsDeletingFolder(false);
    }
  };

  const FileIconComponent = ({ fileName }) => {
    const IconComponent = getFileIcon(fileName);
    return <IconComponent />;
  };

  return (
    <div className={`folder-modal ${folder ? 'open' : ''}`} onClick={onClose}>
      <div className="folder-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="folder-modal-header">
          <h2 className="folder-modal-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }}>
              <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z"/>
            </svg>
            {folder.name}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              className="folder-delete-btn"
              onClick={handleDeleteFolder}
              disabled={isDeletingFolder}
              title="Удалить папку"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              {isDeletingFolder ? 'Удаление...' : 'Удалить папку'}
            </button>
            <button className="folder-modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="files-grid">
          {files && files.length > 0 ? (
            files.map(file => (
              <div 
                key={file.id} 
                className={`file-item ${removingFileId === file.id ? 'removing' : ''}`}
                onClick={() => handleDownloadFile(file.id)}
                style={{ cursor: 'pointer' }}
                title="Клик для скачивания"
              >
                <div className="file-icon-svg-wrapper">
                  {downloadingFileId === file.id ? (
                    <div className="loading-spinner" />
                  ) : (
                    <FileIconComponent fileName={file.original_name || file.name} />
                  )}
                </div>
                <div className="file-name-wrapper">
                  <div className="file-name">
                    {file.original_name || file.name}
                    {downloadingFileId === file.id && ' (скачивание...)'}
                  </div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </div>
                <button 
                  className="file-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.5)',
              padding: '2rem'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 1rem', opacity: 0.5 }}>
                <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z"/>
                <line x1="12" y1="11" x2="12" y2="17"/>
                <line x1="9" y1="14" x2="15" y2="14"/>
              </svg>
              В этой папке пока нет файлов
            </div>
          )}

          <div 
            className={`add-file-btn ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 0.5rem' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <div>Перетащите файл сюда или кликните для выбора</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.5rem' }}>
                Поддерживаются все форматы: PDF, DOCX, XLSX, PPTX и другие
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}