import React from 'react';

// Иконка для PDF
export const PdfIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#FF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#FF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="8" y="17" fontSize="8" fill="#FF4444" fontWeight="bold">PDF</text>
  </svg>
);

// Иконка для DOC/DOCX (Word)
export const WordIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#2B5797" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#2B5797" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="8" y="17" fontSize="8" fill="#2B5797" fontWeight="bold">W</text>
  </svg>
);

// Иконка для XLS/XLSX (Excel)
export const ExcelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#217346" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#217346" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="8" y="17" fontSize="8" fill="#217346" fontWeight="bold">X</text>
  </svg>
);

// Иконка для PPT/PPTX (PowerPoint)
export const PowerPointIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#D24726" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#D24726" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="8" y="17" fontSize="8" fill="#D24726" fontWeight="bold">P</text>
  </svg>
);

// Иконка для изображений
export const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" stroke="#FF6B6B" strokeWidth="2"/>
    <path d="M21 15L16 10L5 21" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Иконка для видео
export const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#9B59B6" strokeWidth="2"/>
    <polygon points="10,8 16,12 10,16" stroke="#9B59B6" strokeWidth="2" fill="none"/>
  </svg>
);

// Иконка для аудио
export const AudioIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M3 18V12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V18" stroke="#3498DB" strokeWidth="2" strokeLinecap="round"/>
    <rect x="5" y="14" width="4" height="6" rx="1" stroke="#3498DB" strokeWidth="2"/>
    <rect x="15" y="14" width="4" height="6" rx="1" stroke="#3498DB" strokeWidth="2"/>
    <line x1="9" y1="18" x2="9" y2="20" stroke="#3498DB" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="18" x2="15" y2="20" stroke="#3498DB" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Иконка для архивов
export const ArchiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M21 8V21H3V8" stroke="#F39C12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 3H23V8H1V3Z" stroke="#F39C12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="12" x2="14" y2="12" stroke="#F39C12" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="16" x2="14" y2="16" stroke="#F39C12" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Иконка для текстовых файлов
export const TextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="13" x2="16" y2="13" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="17" x2="14" y2="17" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Иконка для кода/программирования
export const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="8,13 11,16 8,19" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,13 13,16 16,19" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Иконка для исполняемых файлов
export const ExecutableIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="8" y="14" width="8" height="6" rx="1" stroke="#E74C3C" strokeWidth="2"/>
    <circle cx="12" cy="14" r="1" fill="#E74C3C"/>
  </svg>
);

// Иконка для обычных файлов (по умолчанию)
export const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="file-icon-svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="13" x2="16" y2="13" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="17" x2="14" y2="17" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Функция для получения иконки по расширению
export const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  
  switch(ext) {
    case 'pdf':
      return PdfIcon;
    case 'doc':
    case 'docx':
      return WordIcon;
    case 'xls':
    case 'xlsx':
      return ExcelIcon;
    case 'ppt':
    case 'pptx':
      return PowerPointIcon;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'bmp':
    case 'ico':
      return ImageIcon;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'mkv':
      return VideoIcon;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
      return AudioIcon;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
    case 'bz2':
      return ArchiveIcon;
    case 'txt':
    case 'md':
    case 'log':
    case 'csv':
      return TextIcon;
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
    case 'h':
    case 'php':
    case 'rb':
    case 'go':
    case 'rs':
      return CodeIcon;
    case 'exe':
    case 'msi':
    case 'dmg':
    case 'app':
      return ExecutableIcon;
    default:
      return FileIcon;
  }
};