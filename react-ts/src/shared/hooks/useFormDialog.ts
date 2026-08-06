import { useState, useCallback } from 'react'

/**
 * Custom hook for managing form dialog state
 * Handles opening/closing dialog, form state, validation, and reset
 *
 * @template T The shape of the form data
 * @param initialForm Initial form values
 * @param onSave Callback when form is saved (receives form data)
 * @returns Object with form state, dialog controls, and handlers
 *
 * @example
 * const { form, setForm, dialogOpen, toggleDialog, reset, handleSave } = useFormDialog(
 *   { title: '', notes: '' },
 *   (data) => addItem(data)
 * )
 */
export function useFormDialog<T extends Record<string, any>>(
  initialForm: T,
  onSave: (formData: T) => void,
  validate?: (formData: T) => boolean
) {
  const [form, setForm] = useState<T>(initialForm)
  const [dialogOpen, setDialogOpen] = useState(false)

  const toggleDialog = useCallback(() => {
    setDialogOpen((prev) => !prev)
  }, [])

  const openDialog = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
    reset()
  }, [])

  const reset = useCallback(() => {
    setForm(initialForm)
  }, [initialForm])

  const handleSave = useCallback(() => {
    // Run validation if provided
    if (validate && !validate(form)) {
      return
    }
    onSave(form)
    closeDialog()
  }, [form, onSave, validate, closeDialog])

  const updateForm = useCallback(
    (updates: Partial<T>) => {
      setForm((prev) => ({ ...prev, ...updates }))
    },
    []
  )

  return {
    form,
    setForm,
    updateForm,
    dialogOpen,
    setDialogOpen,
    toggleDialog,
    openDialog,
    closeDialog,
    reset,
    handleSave,
  }
}
