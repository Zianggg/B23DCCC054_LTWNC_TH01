import { useCallback, useState } from 'react'

/**
 * Custom hook nâng cao (Buổi 2): form generic, không phụ thuộc UI.
 * T tái sử dụng cho mọi form — assignment, settings, v.v.
 */
export function useForm<T extends object>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
  }, [initialValues])

  return { values, setField, setValues, reset }
}
