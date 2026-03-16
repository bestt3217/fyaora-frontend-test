import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { SuccessSnackbar } from '@/components/ui/SuccessSnackbar'
import { ToastContext } from '@/types/toast'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const showToast = useCallback((msg: string) => {
    setMessage(msg)
    setOpen(true)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <SuccessSnackbar
        open={open}
        message={message}
        onClose={() => setOpen(false)}
      />
    </ToastContext.Provider>
  )
}
