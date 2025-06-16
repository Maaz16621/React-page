
import React, { useState, useCallback, useRef } from 'react';
import type { Page, ContextMenuState } from '../types'; // Corrected path
import { INITIAL_PAGES } from '../constants'; // Corrected path
import PageNavigation from './PageNavigation'; // Corrected path

const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
  const [activePageId, setActivePageId] = useState<string | null>(
    INITIAL_PAGES.length > 0 ? INITIAL_PAGES[0].id : null
  );
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState | null>(null);
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [dragOverDropZoneIndex, setDragOverDropZoneIndex] = useState<number | null>(null);
  
  const lastOpenedContextMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleSelectPage = useCallback((id: string) => {
    setActivePageId(id);
    setContextMenuState(null); // Close context menu on page selection
  }, []);

  const handleAddPage = useCallback((index: number) => {
    const newPageName = `New Page ${pages.length + 1}`;
    const newPage: Page = { id: self.crypto.randomUUID(), name: newPageName };
    setPages(currentPages => {
      const newPages = [...currentPages];
      newPages.splice(index, 0, newPage);
      return newPages;
    });
    setActivePageId(newPage.id);
    setContextMenuState(null);
  }, [pages.length]);

  const handleDeletePage = useCallback((id: string) => {
    setPages(currentPages => {
      const pageIndexToDelete = currentPages.findIndex(page => page.id === id);
      const newPages = currentPages.filter(page => page.id !== id);
      if (activePageId === id) {
        if (newPages.length > 0) {
          setActivePageId(newPages[Math.max(0, pageIndexToDelete - 1)]?.id || newPages[0]?.id || null);
        } else {
          setActivePageId(null);
        }
      }
      return newPages;
    });
    setContextMenuState(null);
  }, [activePageId]);

  const handleDuplicatePage = useCallback((id: string) => {
    setPages(currentPages => {
      const pageToDuplicate = currentPages.find(page => page.id === id);
      if (!pageToDuplicate) return currentPages;
      
      const newPage: Page = { 
        ...pageToDuplicate, 
        id: self.crypto.randomUUID(),
        name: `${pageToDuplicate.name} (Copy)` 
      };
      
      const index = currentPages.findIndex(page => page.id === id);
      const newPages = [...currentPages];
      newPages.splice(index + 1, 0, newPage);
      setActivePageId(newPage.id); // Set new duplicated page as active
      return newPages;
    });
    setContextMenuState(null);
  }, []);

  const handleRenamePage = useCallback((id: string, newName: string) => {
    setPages(currentPages => 
      currentPages.map(page => 
        page.id === id ? { ...page, name: newName } : page
      )
    );
    setContextMenuState(null);
  }, []);

  const handleDragStartPage = useCallback((id: string, event: React.DragEvent<HTMLDivElement>) => {
    setDraggedPageId(id);
  }, []);

  const handleDragEndPage = useCallback(() => {
    setDraggedPageId(null);
    setDragOverDropZoneIndex(null);
  }, []);

  const handleMovePage = useCallback((draggedId: string, targetDropZoneLineIndex: number) => {
    if (!draggedPageId) return; // Should use draggedId from params for consistency

    setPages(currentPages => {
      const sourcePageIndex = currentPages.findIndex(p => p.id === draggedId);
      if (sourcePageIndex === -1) return currentPages;
  
      const newPages = [...currentPages];
      const [itemToMove] = newPages.splice(sourcePageIndex, 1);
  
      // The targetDropZoneLineIndex is the line *before* which to insert.
      // If dragging downwards past its original position, the target index effectively shifts.
      let actualInsertionIndex = targetDropZoneLineIndex;
      if (sourcePageIndex < targetDropZoneLineIndex) {
        // If item was moved from an earlier position to a later position,
        // the target index in the modified array (after splice) is one less.
        actualInsertionIndex--;
      }
      
      actualInsertionIndex = Math.max(0, Math.min(newPages.length, actualInsertionIndex));
  
      newPages.splice(actualInsertionIndex, 0, itemToMove);
      return newPages;
    });
  }, [draggedPageId]); // Keep draggedPageId dependency if it's used to gate the call, but use param `draggedId` inside.


  const handleDragOverDropZone = useCallback((index: number, event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); 
    if (draggedPageId) { 
        setDragOverDropZoneIndex(index);
    }
  }, [draggedPageId]);

  const handleDragLeaveDropZone = useCallback(() => {
     // Intentionally left sparse; specific visual cues are on DropZone itself.
     // Could clear dragOverDropZoneIndex here if not hovering any valid zone after a delay.
  }, []);


  const handleOpenContextMenu = useCallback((pageId: string, buttonRef: React.RefObject<HTMLButtonElement>, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenuState({
        pageId,
        x: rect.left, // Position relative to viewport
        y: rect.bottom + 5,
      });
      lastOpenedContextMenuButtonRef.current = buttonRef.current;
    }
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenuState(null);
    // lastOpenedContextMenuButtonRef.current = null; // Clearing this is handled by ContextMenu's own logic or if needed here.
  }, []);
  
  return (
    <div className="flex justify-center items-start min-h-screen pt-5">
      <PageNavigation
        pages={pages}
        activePageId={activePageId}
        contextMenuState={contextMenuState}
        draggedPageId={draggedPageId}
        dragOverDropZoneIndex={dragOverDropZoneIndex}
        lastOpenedContextMenuButtonRef={lastOpenedContextMenuButtonRef} // Pass down the ref
        onSelectPage={handleSelectPage}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
        onDuplicatePage={handleDuplicatePage}
        onRenamePage={handleRenamePage}
        onMovePage={handleMovePage}
        onDragStartPage={handleDragStartPage}
        onDragEndPage={handleDragEndPage}
        onDragOverDropZone={handleDragOverDropZone}
        onDragLeaveDropZone={handleDragLeaveDropZone}
        onOpenContextMenu={handleOpenContextMenu}
        onCloseContextMenu={handleCloseContextMenu}
      />
    </div>
  );
};

export default App;