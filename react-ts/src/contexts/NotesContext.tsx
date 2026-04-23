import { createContext, useContext, useState, useCallback, useEffect } from 'react'

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

const NOTES_STORAGE_KEY = 'itw_notes'

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState('')

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY)
      if (saved) {
        setNotes(JSON.parse(saved))
      }
    } catch {
      console.error('Failed to load notes')
    }
  }, [])

  // Auto-save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
    } catch {
      console.error('Failed to save notes')
    }
  }, [notes])

  const addNote = useCallback((content: string, page: string) => {
    if (!content.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      content: content.trim(),
      timestamp: Date.now(),
      page,
    }

    setNotes((prev) => [newNote, ...prev])
    setCurrentNote('')
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  const updateNote = useCallback((id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              content: content.trim(),
              timestamp: Date.now(),
            }
          : note
      )
    )
  }, [])

  const getAllNotes = useCallback(() => {
    return notes.sort((a, b) => b.timestamp - a.timestamp)
  }, [notes])

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
