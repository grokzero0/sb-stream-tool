import { X } from 'lucide-react'
import { JSX } from 'react'
import { toast } from 'sonner'

function ToastHandler(): JSX.Element {
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
  return <></>
}

export default ToastHandler
