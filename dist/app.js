// --- Constants (originally from constants.tsx) ---
const PlusIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className || "w-5 h-5" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" })
  )
);

const EllipsisVerticalIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className || "w-5 h-5" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" })
  )
);

const PencilIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className || "w-4 h-4 mr-2" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" })
  )
);

const DocumentDuplicateIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className || "w-4 h-4 mr-2" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m9.75 0h-3.375c-.621 0-1.125.504-1.125 1.125v9.25c0 .621.504 1.125 1.125 1.125h3.375c.621 0 1.125-.504 1.125-1.125v-9.25Z" })
  )
);

const TrashIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className || "w-4 h-4 mr-2" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.111 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" })
  )
);

const INITIAL_PAGES = [
  { id: self.crypto.randomUUID(), name: "Info" },
  { id: self.crypto.randomUUID(), name: "Details" },
  { id: self.crypto.randomUUID(), name: "Other" },
  { id: self.crypto.randomUUID(), name: "Ending" },
];

// --- DropZone component (originally from components/DropZone.tsx) ---
const DropZone = ({ index, onDrop, onAddPage, isDragOver, isDraggingActive }) => {
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    onDrop(index);
  };

  const baseClasses = "relative my-0.5 group transition-all duration-150 ease-in-out";
  const dragOverClasses = "bg-blue-100 h-10";
  const idleClasses = "h-6"; 
  const hoverIdleClasses = !isDraggingActive ? "hover:bg-slate-100" : "";

  return (
    React.createElement("div", {
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      className: `${baseClasses} ${isDragOver ? dragOverClasses : `${idleClasses} ${hoverIdleClasses}`}`,
      "data-testid": `drop-zone-${index}`
    },
      isDragOver && (
        React.createElement("div", { className: "absolute inset-x-0 top-1/2 h-0.5 bg-blue-500 transform -translate-y-1/2" })
      ),
      !isDraggingActive && (
        React.createElement("button", {
          onClick: () => onAddPage(index),
          className: "absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150",
          "aria-label": `Add page at position ${index + 1}`
        },
          React.createElement(PlusIcon, { className: "w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" })
        )
      )
    )
  );
};

// --- ContextMenu component (originally from components/ContextMenu.tsx) ---
const ContextMenu = ({
  pageId,
  position,
  onRename,
  onDuplicate,
  onDelete,
  onClose,
  triggerButtonRef,
}) => {
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerButtonRef.current && 
        !triggerButtonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose, triggerButtonRef]);

  const handleAction = (action) => {
    action();
    onClose(); 
  };

  return (
    React.createElement("div", {
      ref: menuRef,
      className: "fixed z-50 bg-white shadow-xl rounded-md py-2 w-48 border border-slate-200",
      style: { top: position.y, left: position.x },
      "data-testid": `context-menu-${pageId}`,
      role: "menu",
      "aria-orientation": "vertical",
      "aria-labelledby": `page-item-${pageId}-options-button`
    },
      React.createElement("button", {
        onClick: () => handleAction(() => onRename(pageId)),
        className: "w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center transition-colors",
        role: "menuitem"
      },
        React.createElement(PencilIcon, null), " Rename"
      ),
      React.createElement("button", {
        onClick: () => handleAction(() => onDuplicate(pageId)),
        className: "w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center transition-colors",
        role: "menuitem"
      },
        React.createElement(DocumentDuplicateIcon, null), " Duplicate"
      ),
      React.createElement("button", {
        onClick: () => handleAction(() => onDelete(pageId)),
        className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition-colors",
        role: "menuitem"
      },
        React.createElement(TrashIcon, null), " Delete"
      )
    )
  );
};

// --- PageItem component (originally from PageItem.tsx) ---
const PageItem = ({
  page,
  isActive,
  isDragged,
  onSelect,
  onDragStart,
  onDragEnd,
  onOpenContextMenu,
}) => {
  const contextMenuButtonRef = React.useRef(null);

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', page.id);
    onDragStart(page.id, event);
  };

  return (
    React.createElement("div", {
      draggable: true,
      onDragStart: handleDragStart,
      onDragEnd: onDragEnd,
      className: `
        flex items-center justify-between p-3 my-1 rounded-md cursor-grab
        transition-all duration-150 ease-in-out group
        ${isActive ? 'bg-blue-500 text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'}
        ${isDragged ? 'opacity-50 scale-95 shadow-lg' : 'opacity-100'}
      `,
      onClick: () => onSelect(page.id),
      "data-testid": `page-item-${page.id}`
    },
      React.createElement("span", { className: "font-medium truncate select-none" }, page.name),
      React.createElement("button", {
        ref: contextMenuButtonRef,
        "data-context-menu-trigger": "true",
        onClick: (e) => {
          e.stopPropagation(); 
          if (contextMenuButtonRef) { 
             onOpenContextMenu(page.id, contextMenuButtonRef, e);
          }
        },
        className: `
          p-1 rounded
          ${isActive ? 'text-white hover:bg-blue-400' : 'text-slate-400 hover:bg-slate-200 group-hover:text-slate-500'}
          transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100
        `,
        "aria-label": `Options for ${page.name}`
      },
        React.createElement(EllipsisVerticalIcon, { className: "w-5 h-5" })
      )
    )
  );
};

// --- PageNavigation component (originally from components/PageNavigation.tsx) ---
const PageNavigation = ({
  pages,
  activePageId,
  contextMenuState,
  draggedPageId,
  dragOverDropZoneIndex,
  lastOpenedContextMenuButtonRef,
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
  const handleDrop = (index) => {
    if (draggedPageId) {
      onMovePage(draggedPageId, index);
    }
  };

  return (
    React.createElement("div", { className: "w-72 bg-gray-50 p-3 rounded-lg shadow-lg h-[calc(100vh-40px)] flex flex-col m-5" },
      React.createElement("h2", { className: "text-xl font-semibold text-slate-800 mb-4 px-1" }, "Pages"),
      React.createElement("div", {
        className: "flex-grow overflow-y-auto pr-1"
      },
        React.createElement(DropZone, {
          index: 0,
          onDrop: handleDrop,
          onAddPage: onAddPage,
          isDragOver: dragOverDropZoneIndex === 0 && draggedPageId !== null,
          isDraggingActive: draggedPageId !== null
        }),
        pages.map((page, index) => (
          React.createElement(React.Fragment, { key: page.id },
            React.createElement("div", {
              onDragOver: (e) => onDragOverDropZone(index, e),
              onDragLeave: onDragLeaveDropZone
            },
              React.createElement(PageItem, {
                page: page,
                isActive: page.id === activePageId,
                isDragged: page.id === draggedPageId,
                onSelect: onSelectPage,
                onDragStart: onDragStartPage,
                onDragEnd: onDragEndPage,
                onOpenContextMenu: onOpenContextMenu
              })
            ),
            React.createElement("div", {
              onDragOver: (e) => onDragOverDropZone(index + 1, e),
              onDragLeave: onDragLeaveDropZone
            },
              React.createElement(DropZone, {
                index: index + 1,
                onDrop: handleDrop,
                onAddPage: onAddPage,
                isDragOver: dragOverDropZoneIndex === (index + 1) && draggedPageId !== null,
                isDraggingActive: draggedPageId !== null
              })
            )
          )
        ))
      ),
      contextMenuState && (
        React.createElement(ContextMenu, {
          pageId: contextMenuState.pageId,
          position: { x: contextMenuState.x, y: contextMenuState.y },
          onRename: (id) => {
            const pageToRename = pages.find(p => p.id === id);
            const newName = prompt("Enter new page name:", pageToRename?.name || "");
            if (newName && newName.trim() !== "") onRenamePage(id, newName.trim());
          },
          onDuplicate: onDuplicatePage,
          onDelete: onDeletePage,
          onClose: onCloseContextMenu,
          triggerButtonRef: lastOpenedContextMenuButtonRef
        })
      )
    )
  );
};

// --- App component (originally from components/App.tsx) ---
const App = () => {
  const [pages, setPages] = React.useState(INITIAL_PAGES);
  const [activePageId, setActivePageId] = React.useState(
    INITIAL_PAGES.length > 0 ? INITIAL_PAGES[0].id : null
  );
  const [contextMenuState, setContextMenuState] = React.useState(null);
  const [draggedPageId, setDraggedPageId] = React.useState(null);
  const [dragOverDropZoneIndex, setDragOverDropZoneIndex] = React.useState(null);
  
  const lastOpenedContextMenuButtonRef = React.useRef(null);

  const handleSelectPage = React.useCallback((id) => {
    setActivePageId(id);
    setContextMenuState(null); 
  }, []);

  const handleAddPage = React.useCallback((index) => {
    const newPageName = `New Page ${pages.length + 1}`;
    const newPage = { id: self.crypto.randomUUID(), name: newPageName };
    setPages(currentPages => {
      const newPages = [...currentPages];
      newPages.splice(index, 0, newPage);
      return newPages;
    });
    setActivePageId(newPage.id);
    setContextMenuState(null);
  }, [pages.length]);

  const handleDeletePage = React.useCallback((id) => {
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

  const handleDuplicatePage = React.useCallback((id) => {
    setPages(currentPages => {
      const pageToDuplicate = currentPages.find(page => page.id === id);
      if (!pageToDuplicate) return currentPages;
      
      const newPage = { 
        ...pageToDuplicate, 
        id: self.crypto.randomUUID(),
        name: `${pageToDuplicate.name} (Copy)` 
      };
      
      const index = currentPages.findIndex(page => page.id === id);
      const newPages = [...currentPages];
      newPages.splice(index + 1, 0, newPage);
      setActivePageId(newPage.id); 
      return newPages;
    });
    setContextMenuState(null);
  }, []);

  const handleRenamePage = React.useCallback((id, newName) => {
    setPages(currentPages => 
      currentPages.map(page => 
        page.id === id ? { ...page, name: newName } : page
      )
    );
    setContextMenuState(null);
  }, []);

  const handleDragStartPage = React.useCallback((id, event) => {
    setDraggedPageId(id);
  }, []);

  const handleDragEndPage = React.useCallback(() => {
    setDraggedPageId(null);
    setDragOverDropZoneIndex(null);
  }, []);

  const handleMovePage = React.useCallback((draggedId, targetDropZoneLineIndex) => {
    if (!draggedId) return; 

    setPages(currentPages => {
      const sourcePageIndex = currentPages.findIndex(p => p.id === draggedId);
      if (sourcePageIndex === -1) return currentPages;
  
      const newPages = [...currentPages];
      const [itemToMove] = newPages.splice(sourcePageIndex, 1);
  
      let actualInsertionIndex = targetDropZoneLineIndex;
      if (sourcePageIndex < targetDropZoneLineIndex) {
        actualInsertionIndex--;
      }
      
      actualInsertionIndex = Math.max(0, Math.min(newPages.length, actualInsertionIndex));
  
      newPages.splice(actualInsertionIndex, 0, itemToMove);
      return newPages;
    });
  }, []); 


  const handleDragOverDropZone = React.useCallback((index, event) => {
    event.preventDefault(); 
    if (draggedPageId) { 
        setDragOverDropZoneIndex(index);
    }
  }, [draggedPageId]);

  const handleDragLeaveDropZone = React.useCallback(() => {
     // Intentionally sparse
  }, []);


  const handleOpenContextMenu = React.useCallback((pageId, buttonRef, event) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenuState({
        pageId,
        x: rect.left, 
        y: rect.bottom + 5,
      });
      lastOpenedContextMenuButtonRef.current = buttonRef.current;
    }
  }, []);

  const handleCloseContextMenu = React.useCallback(() => {
    setContextMenuState(null);
  }, []);
  
  return (
    React.createElement("div", { className: "flex justify-center items-start min-h-screen pt-5" },
      React.createElement(PageNavigation, {
        pages: pages,
        activePageId: activePageId,
        contextMenuState: contextMenuState,
        draggedPageId: draggedPageId,
        dragOverDropZoneIndex: dragOverDropZoneIndex,
        lastOpenedContextMenuButtonRef: lastOpenedContextMenuButtonRef,
        onSelectPage: handleSelectPage,
        onAddPage: handleAddPage,
        onDeletePage: handleDeletePage,
        onDuplicatePage: handleDuplicatePage,
        onRenamePage: handleRenamePage,
        onMovePage: handleMovePage,
        onDragStartPage: handleDragStartPage,
        onDragEndPage: handleDragEndPage,
        onDragOverDropZone: handleDragOverDropZone,
        onDragLeaveDropZone: handleDragLeaveDropZone,
        onOpenContextMenu: handleOpenContextMenu,
        onCloseContextMenu: handleCloseContextMenu
      })
    )
  );
};

// --- Entry point (originally from index.tsx) ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Assuming React and ReactDOM are available via import map
const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
);
