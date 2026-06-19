import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null)
  const resolveRef = useRef(null)

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setState({
        title: options.title || 'Confirm action',
        message: options.message || 'Are you sure you want to continue?',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        variant: options.variant || 'primary',
      })
    })
  }, [])

  const close = useCallback((result) => {
    resolveRef.current?.(result)
    resolveRef.current = null
    setState(null)
  }, [])

  const value = useMemo(() => ({ confirm }), [confirm])

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {state ? (
        <ConfirmDialog
          {...state}
          onConfirm={() => close(true)}
          onCancel={() => close(false)}
        />
      ) : null}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)

  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }

  return context.confirm
}
