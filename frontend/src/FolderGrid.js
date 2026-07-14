import React from 'react';
import FolderCard from './FolderCard';
import AddFolderButton from './AddFolderButton';

export default function FolderGrid({ 
  folders, 
  onAddFolder, 
  onUpdateFolder, 
  onDeleteFolder, 
  onOpenFolder 
}) {
  console.log('FolderGrid render, folders:', folders.length);
  
  return (
    <div className="grid">
      {folders.map(folder => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onUpdate={onUpdateFolder}
          onDelete={onDeleteFolder}
          onOpen={onOpenFolder}
        />
      ))}
      <AddFolderButton onClick={onAddFolder} />
    </div>
  );
}