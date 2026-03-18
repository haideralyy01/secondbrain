import { Button } from "./components/Button"
import { PlusIcon } from "./icons/PlusIcon"
import { ShareIcon } from "./icons/ShareIcon"

function App() {

  return (
    <>
      <Button variant="primary" text="Add content" startIcon={<PlusIcon />} />
      <Button variant="secondary" text="Share brain" startIcon={<ShareIcon />} />
    </>
  )
}

export default App
