import { Button } from './components/ui/button'

function App(): React.JSX.Element {
  return (
    <Button className="w-full" onClick={() => window.electronAPI.send('ping')}>
      Test
    </Button>
  )
}

export default App
