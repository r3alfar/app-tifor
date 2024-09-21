import { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import { getAuth, signOut } from 'firebase/auth'
import './Home.css'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/repository/firebase/config'

interface UserDetail {
  fullname: string;
  employee_id: string;
  email: string;
  createdAt: Number;
}


function Home() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  let accDetail: any = {}



  useEffect(() => {
    if (!user) {
      console.log("User not logged in");
      navigate('/', { replace: true })
    } else {
      getAccountDetail(user.uid)
        .then(data => {
          accDetail = data
          setUserDetail(accDetail)
          console.log("Account Detail", accDetail)
        })
        .catch(error => {
          console.log("Error getting account detail", error)
        })
    }
  }, [user, navigate])

  if (!user) {
    console.log("PUser not logged in");
    return <div>Redirecting...</div>
  }


  async function getAccountDetail(userId: string) {
    try {
      const docRef = doc(db, `users-activity/${userId}/account/account-detail`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data())
        return docSnap.data()
      } else {
        console.log("No such document!")
        return null
      }
    } catch (error) {
      console.log("Error getting account detail", error)

    }
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

  async function navigateTasks() {
    navigate('/tasks')
  }

  return (
    <main className='flex items-center justify-center min-h-[calc(80vh-64px)]'>
      <div className='text-center'>
        <div
          className="flex flex-col "
        >
          <h1
            className="font-semibold"
          >Welcome,</h1>
          <h1
            className="font-extrabold "
          >{userDetail?.fullname}</h1>

          <Button
            className="mt-6"
            type="submit"
            variant="secondary"
            onClick={() => navigateMyLog()}
          >Activity Log</Button>

          <Button
            className="mt-6"
            type="submit"
            variant="secondary"
            onClick={() => navigateTasks()}
          >Tasks List</Button>
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