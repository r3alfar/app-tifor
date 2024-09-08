import { useState } from 'react'
import './Aapp.css'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import Auth from '../auth/Auth'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <div className="">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <ModeToggle />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className='mt-2 items-center justify-center'>
        <Auth />
      </div>

    </>
  )
}

export default App
