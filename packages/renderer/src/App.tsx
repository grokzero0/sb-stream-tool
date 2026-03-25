import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./components/ui/dialog";

function App() {
  return (
    <>
      <Button>button</Button>
      <Dialog>
        <DialogTrigger>Test</DialogTrigger>
        <DialogHeader>Test</DialogHeader>
        <DialogContent>l</DialogContent>
      </Dialog>
    </>
  );
}

export default App;
