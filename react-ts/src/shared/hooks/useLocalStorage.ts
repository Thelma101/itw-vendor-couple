import { useState, useCallback } from 'react'

/**
 * Custom hook for managing localStorage with JSON serialization
 * Handles parsing, error handling, and default values automatically
 *
 * @template T The type of data being stored
 * @param key Storage key
 * @param defaultValue Default value if storage is empty or invalid
 * @returns Object with data, save function, and clear function
 *
 * @example
 * const { data: tasks, save, clear } = useLocalStorage('my_tasks', [])
 * save([...tasks, newTask])
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [data, setData] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return defaultValue
      const parsed = JSON.parse(raw) as T
      // If the parsed data is falsy or empty array, use default
      if (Array.isArray(parsed) && parsed.length === 0) {
        return defaultValue
      }
      return parsed
    } catch (error) {
      console.warn(`Failed to parse localStorage[${key}]:`, error)
      return defaultValue
    }
  })

  const save = useCallback(
    (newData: T) => {
      try {
        setData(newData)
        localStorage.setItem(key, JSON.stringify(newData))
      } catch (error) {
        console.error(`Failed to save to localStorage[${key}]:`, error)
      }
    },
    [key]
  )

  const clear = useCallback(() => {
    try {
      setData(defaultValue)
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Failed to clear localStorage[${key}]:`, error)
    }
  }, [key, defaultValue])

  return { data, save, clear }
}
