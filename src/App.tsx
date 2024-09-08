import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import Home from './views/home/Home'
import Auth from './views/auth/Auth'
function App() {
  return (
    <Router>
      <div>
        <main>
          <Routes>
            <Route path='' element={<Auth />} />
            <Route path='/home' element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App