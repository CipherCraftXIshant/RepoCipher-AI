import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

const DropdownContext = createContext({
  open: false,
  setOpen: () => {},
});

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children, className, ...props }) {
  const { open, setOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      "aria-haspopup": "true",
      "aria-expanded": open,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-haspopup="true"
      aria-expanded={open}
      className={cn("cursor-pointer focus:outline-none", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  align = "right",
  className,
  children,
  ...props
}) {
  const { open } = useContext(DropdownContext);

  if (!open) return null;

  const alignmentClasses = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
    center: "left-1/2 -translate-x-1/2 origin-top",
  };

  return (
    <div
      role="menu"
      className={cn(
        "absolute mt-1.5 z-50 min-w-[10rem] overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1 text-slate-800 shadow-popover animate-in fade-in zoom-in-95 duration-100",
        alignmentClasses[align] || alignmentClasses.right,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  className,
  destructive = false,
  disabled = false,
  onSelect,
  children,
  ...props
}) {
  const { setOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    if (disabled) return;
    e.stopPropagation();
    if (onSelect) onSelect(e);
    setOpen(false);
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none transition-colors",
        destructive
          ? "text-rose-600 hover:bg-rose-50 focus:bg-rose-50"
          : "text-slate-700 hover:bg-slate-100 focus:bg-slate-100 hover:text-slate-900",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }) {
  return <div className={cn("-mx-1 my-1 h-px bg-slate-100", className)} />;
}
