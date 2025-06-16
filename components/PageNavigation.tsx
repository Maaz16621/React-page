
import React from 'react';
import type { Page, ContextMenuState } from '../types';
import PageItem from '../PageItem'; // Corrected path
import DropZone from './DropZone';
import ContextMenu from './ContextMenu';

interface PageNavigationProps {
  pages: Page[];
  activePageId: string | null;
  contextMenuState: ContextMenuState | null;
  draggedPageId: string | null;
  dragOverDropZoneIndex: number | null;
  lastOpenedContextMenuButtonRef: React.RefObject<HTMLButtonElement | null>; // Added prop
  onSelectPage: (id: string) => void;
  onAddPage: (index: number) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id:string) => void;
  onRenamePage: (id: string, newName: string) => void; 
  onMovePage: (draggedId: string, targetIndex: number) => void;
  onDragStartPage: (id: string, event: React.DragEvent<HTMLDivElement>) => void;
  onDragEndPage: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOverDropZone: (index: number, event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeaveDropZone: () => void;
  onOpenContextMenu: (pageId: string, buttonRef: React.RefObject<HTMLButtonElement>, event: React.MouseEvent) => void;
  onCloseContextMenu: () => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  pages,
  activePageId,
  contextMenuState,
  draggedPageId,
  dragOverDropZoneIndex,
  lastOpenedContextMenuButtonRef, // Use prop
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
  onRenamePage,
  onMovePage,
  onDragStartPage,
  onDragEndPage,
  onDragOverDropZone,
  onDragLeaveDropZone,
  onOpenContextMenu,
  onCloseContextMenu,
}) => {
  const handleDrop = (index: number) => {
    if (draggedPageId) {
      onMovePage(draggedPageId, index);
    }
  };

  return (
    <div className="w-72 bg-gray-50 p-3 rounded-lg shadow-lg h-[calc(100vh-40px)] flex flex-col m-5">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 px-1">Pages</h2>
      <div 
        className="flex-grow overflow-y-auto pr-1"
        // onDragOver and onDrop on this container can be used for "drop outside" logic if needed
      >
        <DropZone
          index={0}
          onDrop={handleDrop} // Use consistent handler
          onAddPage={onAddPage}
          isDragOver={dragOverDropZoneIndex === 0 && draggedPageId !== null}
          isDraggingActive={draggedPageId !== null}
        />
        {pages.map((page, index) => (
          <React.Fragment key={page.id}>
            <div 
              // These handlers on the div wrapping PageItem are for indicating drag over the item itself,
              // but current logic uses DropZones for reordering.
              // For now, these mostly help ensure drag events propagate.
              onDragOver={(e) => onDragOverDropZone(index, e)} // This might be misdirecting if not careful.
                                                              // The DropZone specific dragOver is more important for highlighting.
              onDragLeave={onDragLeaveDropZone} // This might fire too often.
            >
              <PageItem
                page={page}
                isActive={page.id === activePageId}
                isDragged={page.id === draggedPageId}
                onSelect={onSelectPage}
                onDragStart={onDragStartPage}
                onDragEnd={onDragEndPage}
                onOpenContextMenu={onOpenContextMenu}
              />
            </div>
            {/* The DropZone below PageItem is for inserting at index + 1 */}
            <div
              onDragOver={(e) => onDragOverDropZone(index + 1, e)}
              onDragLeave={onDragLeaveDropZone}
            >
              <DropZone
                index={index + 1}
                onDrop={handleDrop} // Use consistent handler
                onAddPage={onAddPage}
                isDragOver={dragOverDropZoneIndex === (index + 1) && draggedPageId !== null}
                isDraggingActive={draggedPageId !== null}
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      {contextMenuState && (
        <ContextMenu
          pageId={contextMenuState.pageId}
          position={{ x: contextMenuState.x, y: contextMenuState.y }}
          onRename={(id) => {
            const pageToRename = pages.find(p => p.id === id);
            const newName = prompt("Enter new page name:", pageToRename?.name || "");
            if (newName && newName.trim() !== "") onRenamePage(id, newName.trim());
          }}
          onDuplicate={onDuplicatePage}
          onDelete={onDeletePage}
          onClose={onCloseContextMenu}
          triggerButtonRef={lastOpenedContextMenuButtonRef} // Pass the ref from props
        />
      )}
    </div>
  );
};

export default PageNavigation;