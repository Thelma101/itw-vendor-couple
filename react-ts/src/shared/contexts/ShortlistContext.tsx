/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useServerState } from '@/shared/hooks/useServerState';
import { useAccount } from '@/shared/contexts/AccountContext';

export interface ShortlistItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  location?: string;
  rating?: number;
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
  useAccount(); // re-render when the signed-in account changes
  const { data: items, save } = useServerState<ShortlistItem[]>('shortlist', {
    demoKey: 'itw_shortlist',
    demo: [],
    empty: [],
  });

  const addToShortlist = (item: ShortlistItem) => {
    void save((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  };

  const removeFromShortlist = (id: string) => {
    void save((prev) => prev.filter((item) => item.id !== id));
  };

  const clearShortlist = () => {
    void save([]);
  };

  const isInShortlist = (id: string) => items.some((item) => item.id === id);

  const updateNotes = (id: string, notes: string) => {
    void save((prev) => prev.map((item) => (item.id === id ? { ...item, notes } : item)));
  };

  return (
    <ShortlistContext.Provider
      value={{ items, addToShortlist, removeFromShortlist, clearShortlist, isInShortlist, updateNotes, totalItems: items.length }}
    >
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
