import React, { createContext, useContext, useState } from 'react';
import type { LetterContextType } from '@/types/navigation';

const LetterContext = createContext<LetterContextType | undefined>(undefined);

export const LetterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showMyLetters, setShowMyLetters] = useState(false);
  return <LetterContext.Provider value={{ showMyLetters, setShowMyLetters }}>{children}</LetterContext.Provider>;
};

export const useLetterFilter = () => {
  const ctx = useContext(LetterContext);
  if (!ctx) throw new Error('useLetterFilter must be used within LetterProvider');
  return ctx;
};
