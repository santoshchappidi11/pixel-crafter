"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { createContext, ReactNode, useContext } from "react";

interface myContextData {
  isDarkMode: string;
  setIsDarkMode: Dispatch<SetStateAction<string>>;
}

const PixelCrafterContext = createContext<myContextData | undefined>(undefined);

export const PixelCrafterProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<string>("light");

  return (
    <PixelCrafterContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </PixelCrafterContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(PixelCrafterContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a PixelCrafterProvider");
  }
  return context;
};
