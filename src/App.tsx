import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './views/home/Home'
import Auth from './views/auth/Auth'
import MyNavbar from './components/custom/myNavbar'
import Footer from './components/custom/footer/Footer'
import CheckIn from './views/myLog/CheckIn'
import ScheduleRecap from './views/scheduleRecap/ScheduleRecap'

const NavbarWrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    <MyNavbar />
    {children}
    <Footer />
  </>
)
function App() {
  return (
    <Router>
      <div>
        <main>
          <Routes>
            <Route path='' element={<Auth />} />
            <Route path='/home' element={<NavbarWrapper><Home /></NavbarWrapper>} />
            <Route path='/mylog' element={<NavbarWrapper><CheckIn className='w-[400px]' /></NavbarWrapper>} />
            <Route path='/schedule' element={<NavbarWrapper><ScheduleRecap /></NavbarWrapper>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App