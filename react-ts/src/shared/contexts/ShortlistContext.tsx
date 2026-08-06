/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface ShortlistItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  capacity?: string;
  notes?: string; // For couple's notes about the vendor
}

interface ShortlistContextType {
  items: ShortlistItem[];
  addToShortlist: (item: ShortlistItem) => void;
  removeFromShortlist: (id: string) => void;
  clearShortlist: () => void;
  isInShortlist: (id: string) => boolean;
  updateNotes: (id: string, notes: string) => void;
  totalItems: number;
}

const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>([]);

  const addToShortlist = (item: ShortlistItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) {
        return prev; // Already in shortlist
      }
      return [...prev, item];
    });
  };

  const removeFromShortlist = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearShortlist = () => {
    setItems([]);
  };

  const isInShortlist = (id: string) => {
    return items.some(item => item.id === id);
  };

  const updateNotes = (id: string, notes: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, notes } : item))
    );
  };

  const totalItems = items.length;

  return (
    <ShortlistContext.Provider value={{ items, addToShortlist, removeFromShortlist, clearShortlist, isInShortlist, updateNotes, totalItems }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (!context) {
    throw new Error('useShortlist must be used within a ShortlistProvider');
  }
  return context;
}
