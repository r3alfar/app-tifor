import './Auth.css'
import { useState } from "react"
import RegisterCard from "./RegisterCard"
import LoginCard from "./LoginCard"


function Auth() {
  const [isRegister, setIsRegister] = useState(false)
  const switchToRegister = () => setIsRegister(true);
  const switchToLogin = () => setIsRegister(false);
  return (
    <div className="full-height">
      <div className="card-width">
        {
          isRegister ?
            <h1>Sign Up</h1>
            :
            <>
              <h1>Hello,</h1>
              <h2>Welcome Back</h2>
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