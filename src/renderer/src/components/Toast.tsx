import { X } from 'lucide-react'
import { JSX } from 'react'
import { toast } from 'sonner'
import { Toaster } from './ui/sonner'

function Toast(): JSX.Element {
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
  return <Toaster />
}

export default Toast
