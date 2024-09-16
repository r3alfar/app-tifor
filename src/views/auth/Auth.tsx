import './Auth.css'
import { useState } from "react"
import RegisterCard from "./RegisterCard"
import LoginCard from "./LoginCard"
// import { initializeApp } from 'firebase/app'
// initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG))
import { firebaseAppInitialize } from '@/repository/firebase/config'

firebaseAppInitialize();

function Auth() {
  const [isRegister, setIsRegister] = useState(false)
  const switchToRegister = () => setIsRegister(true);
  const switchToLogin = () => setIsRegister(false);
  return (
    <div className="full-height">
      <div className="card-width">
        {
          isRegister ?
            <h1 className='font-extrabold text-5xl'>Sign Up</h1>
            :
            <>
              <h1 className='font-semibold'>Hello,</h1>
              <h2 className='font-extrabold text-3xl'>Welcome Back</h2>
            </>
        }

      </div>
      <div className="mt-2 self-center card-width">
        {
          isRegister ?
            <RegisterCard onSwitchToLogin={switchToLogin} /> :
            <LoginCard onSwitchToRegister={switchToRegister} />
        }
      </div>
    </div>
  )
}

export default Auth