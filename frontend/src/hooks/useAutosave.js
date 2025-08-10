import { useEffect, useRef } from 'react'

export default function useAutosave(valueDeps, delayMs, onSave) {
  const timer = useRef(null)
  const latest = useRef({})
  latest.current = { valueDeps, onSave }

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      latest.current.onSave()
    }, delayMs)
    return () => clearTimeout(timer.current)
  }, valueDeps) // eslint-disable-line react-hooks/exhaustive-deps
}
