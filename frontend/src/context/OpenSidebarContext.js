import React, { createContext, useState, useEffect } from "react";

export const OpenSidebarContext = createContext();

export const OpenSidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false); // State for sidebar open/close

  return (
    <OpenSidebarContext.Provider value={{ open, setOpen }}>
      {children} {/* Render children components */}
    </OpenSidebarContext.Provider>
  );
};
