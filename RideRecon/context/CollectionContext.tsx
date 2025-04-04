import { CollectionType } from '@/types';
import React, { createContext, useContext, useState } from 'react';

interface CollectionContextType {
  collects: CollectionType[];
  addCollection: (collection: CollectionType) => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collects, setCollects] = useState<CollectionType[]>([]);

  const addCollection = (collection: CollectionType) => {
    setCollects((prevCollects) => [...prevCollects, collection]);
  };

  return (
    <CollectionContext.Provider value={{ collects, addCollection }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollectionContext = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollectionContext must be used within a CollectionProvider');
  }
  return context;
};
