
import React, { useRef } from 'react';
import type { Page } from './types'; // Corrected path
import { EllipsisVerticalIcon } from './constants'; // Corrected path

interface PageItemProps {
  page: Page;
  isActive: boolean;
  isDragged: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string, event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  onOpenContextMenu: (pageId: string, buttonRef: React.RefObject<HTMLButtonElement>, event: React.MouseEvent) => void;
}

const PageItem: React.FC<PageItemProps> = ({
  page,
  isActive,
  isDragged,
  onSelect,
  onDragStart,
  onDragEnd,
  onOpenContextMenu,
}) => {
  const contextMenuButtonRef = useRef<HTMLButtonElement>(null);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    // It's good practice to set some data, even if not strictly used by this app's internal D&D
    event.dataTransfer.setData('text/plain', page.id);
    onDragStart(page.id, event);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`
        flex items-center justify-between p-3 my-1 rounded-md cursor-grab
        transition-all duration-150 ease-in-out group
        ${isActive ? 'bg-blue-500 text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'}
        ${isDragged ? 'opacity-50 scale-95 shadow-lg' : 'opacity-100'}
      `}
      onClick={() => onSelect(page.id)}
      data-testid={`page-item-${page.id}`}
    >
      <span className="font-medium truncate select-none">{page.name}</span>
      <button
        ref={contextMenuButtonRef}
        data-context-menu-trigger="true"
        onClick={(e) => {
          e.stopPropagation(); // Prevent page selection when clicking menu button
          if (contextMenuButtonRef) { // Ensure ref is available
             onOpenContextMenu(page.id, contextMenuButtonRef, e);
          }
        }}
        className={`
          p-1 rounded
          ${isActive ? 'text-white hover:bg-blue-400' : 'text-slate-400 hover:bg-slate-200 group-hover:text-slate-500'}
          transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100
        `}
        aria-label={`Options for ${page.name}`}
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PageItem;