
import React from 'react';
import { PlusIcon } from '../constants';

interface DropZoneProps {
  index: number;
  onDrop: (index: number) => void;
  onAddPage: (index: number) => void;
  isDragOver: boolean;
  isDraggingActive: boolean; // True if any item is being dragged
}

const DropZone: React.FC<DropZoneProps> = ({ index, onDrop, onAddPage, isDragOver, isDraggingActive }) => {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDrop(index);
  };

  // Base classes for the drop zone
  const baseClasses = "relative my-0.5 group transition-all duration-150 ease-in-out";
  // Classes when a page item is being dragged over this zone
  const dragOverClasses = "bg-blue-100 h-10";
  // Default classes for the zone when idle (no drag operation, or drag not over this zone)
  // Increased height from h-5 to h-6 for better hoverability
  const idleClasses = "h-6"; 
  // Subtle hover background when no drag operation is active and mouse is over the zone
  // PageNavigation is bg-gray-50, so slate-100 provides a gentle contrast
  const hoverIdleClasses = !isDraggingActive ? "hover:bg-slate-100" : "";

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`${baseClasses} ${isDragOver ? dragOverClasses : `${idleClasses} ${hoverIdleClasses}`}`}
      data-testid={`drop-zone-${index}`}
    >
      {isDragOver && (
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-500 transform -translate-y-1/2"></div>
      )}
      {!isDraggingActive && (
        <button
          onClick={() => onAddPage(index)}
          className="absolute inset-0 w-full h-full flex items-center justify-center 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          aria-label={`Add page at position ${index + 1}`}
        >
          <PlusIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </button>
      )}
    </div>
  );
};

export default DropZone;
