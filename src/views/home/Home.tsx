import { useContext, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import { getAuth, signOut } from 'firebase/auth'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext);



  useEffect(() => {
    if (!user) {
      console.log("User not logged in");
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  if (!user) {
    console.log("PUser not logged in");
    return <div>Redirecting...</div>
  }


  async function onLogout() {
    console.log("Logout Clicked")
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("Logged out successfully")
      navigate('/')
    }).catch((error) => {
      console.log("Error logging out", error)
    })

  }

  async function navigateMyLog() {
    navigate('/mylog')
  }

  return (
    <main className='flex items-center justify-center min-h-[calc(100vh-64px)]'>
      <div className='text-center'>
        <div
          className="flex flex-col "
        >
          <h1
            className="font-semibold"
          >Welcome,</h1>
          <h1
            className="font-extrabold "
          >User</h1>

          <Button
            className="mt-6"
            type="submit"
            variant="secondary"
            onClick={() => navigateMyLog()}
          >Activity Log</Button>

          <Button
            className="mt-6"
            type="submit"
            onClick={() => onLogout()}
          >Logout</Button>
        </div>

      </div>
    </main>

  )
}

export default Home