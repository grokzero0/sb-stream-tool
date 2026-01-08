import { X } from 'lucide-react'
import { JSX, useEffect } from 'react'
import { toast } from 'sonner'
import { Toaster } from './ui/sonner'

function Toast(): JSX.Element {
  useEffect(() => {
    window.electronAPI.toastMessage((message, description) => {
      toast(message, {
        action: {
          label: <X />,
          onClick: () => {
            return
          }
        },
        description: description
      })
    })
    return () => window.electronAPI.clearAllListeners('toast-message')
  }, [])
  return <Toaster />
}

export default Toast
