import { createContext, useContext, useState, useCallback } from 'react'
import { useServerState } from '@/shared/hooks/useServerState'
import { useAccount } from '@/shared/contexts/AccountContext'

export interface Note {
  id: string
  content: string
  timestamp: number
  page: string
}

interface NotesContextType {
  notes: Note[]
  currentNote: string
  setCurrentNote: (note: string) => void
  addNote: (content: string, page: string) => void
  deleteNote: (id: string) => void
  updateNote: (id: string, content: string) => void
  getAllNotes: () => Note[]
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: React.ReactNode }) {
  useAccount() // re-render when the signed-in account changes
  const { data: notes, save } = useServerState<Note[]>('notes', { demoKey: 'itw_notes', demo: [], empty: [] })
  const [currentNote, setCurrentNote] = useState('')

  const addNote = useCallback(
    (content: string, page: string) => {
      if (!content.trim()) return
      const newNote: Note = { id: Date.now().toString(), content: content.trim(), timestamp: Date.now(), page }
      void save((prev) => [newNote, ...prev])
      setCurrentNote('')
    },
    [save],
  )

  const deleteNote = useCallback((id: string) => void save((prev) => prev.filter((note) => note.id !== id)), [save])

  const updateNote = useCallback(
    (id: string, content: string) =>
      void save((prev) => prev.map((note) => (note.id === id ? { ...note, content: content.trim(), timestamp: Date.now() } : note))),
    [save],
  )

  const getAllNotes = useCallback(() => [...notes].sort((a, b) => b.timestamp - a.timestamp), [notes])

  return (
    <NotesContext.Provider value={{ notes, currentNote, setCurrentNote, addNote, deleteNote, updateNote, getAllNotes }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider')
  }
  return context
}
