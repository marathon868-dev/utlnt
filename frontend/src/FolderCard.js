import React, { useState, useEffect } from 'react';
import FolderIcon from './FolderIcon';

export default function FolderCard({ folder, onUpdate, onDelete, onOpen }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(folder.name);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = () => {
    console.log('Folder clicked:', folder.id, folder.name);
    onOpen(folder);
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
    console.log('Label clicked - editing mode');
    setIsEditing(true);
    setEditValue(folder.name);
  };

  const handleSave = () => {
    if (editValue.trim() === '') {
      setIsEditing(false);
      return;
    }
    console.log('Saving folder name:', editValue.trim());
    onUpdate(folder.id, editValue.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(folder.name);
    }
  };

  let cardClassName = 'folder-card';
  if (folder.isAdding) cardClassName += ' adding';
  if (folder.isRemoving) cardClassName += ' removing';
  if (isVisible && !folder.isAdding && !folder.isRemoving) cardClassName += ' visible';

  return (
    <div 
      className={cardClassName} 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="folder-icon-wrapper">
        <FolderIcon />
      </div>
      {isEditing ? (
        <input
          type="text"
          className="folder-label-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div 
          className="folder-label" 
          onClick={handleLabelClick}
          title="Клик для редактирования названия"
        >
          {folder.name}
        </div>
      )}
    </div>
  );
}