import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import './Home.css'

export interface UserDetail {
  fullname: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  email: string;
  createdAt: Number;
}

function Home() {
  const navigate = useNavigate()
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)

  useEffect(() => {
    const access_token = localStorage.getItem('access_token')
    const storedUserDetail = localStorage.getItem('userDetail')

    if (!access_token) {
      console.log("User not logged in")
      navigate('/', { replace: true })
    } else if (storedUserDetail) {
      setUserDetail(JSON.parse(storedUserDetail))
    } else {
      // If needed, fetch user details from your API here using the access token
      getAccountDetail(access_token)
        .then(data => {
          if (data) {
            setUserDetail(data)
            localStorage.setItem('userDetail', JSON.stringify(data))
          }
        })
        .catch(error => {
          console.log("Error getting account detail", error)
        })
    }
  }, [navigate])

  async function getAccountDetail(token: string) {
    try {
      // Replace with your API call to fetch user details
      
      const response = await window.api.get(
        `${import.meta.env.VITE_DIRECTUS_BASE_URL}/users/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      if (response.status === 200) {
        console.log("Account Detail", response.data.data)
        if(!response.data.data.fullname){
          response.data.data.fullname = response.data.data.first_name + " " + response.data.data.last_name
        }
        return response.data.data
      }
      return null
    } catch (error) {
      console.log("Error getting account detail", error)
      return null
    }
  }

  function onLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('userDetail')
    navigate('/')
  }

  function navigateMyLog() {
    navigate('/mylog')
  }

  function navigateTasks() {
    navigate('/tasks')
  }

  if (!userDetail) {
    return <div>Loading...</div>
  }

  return (
    <main className='flex items-center justify-center min-h-[calc(80vh-64px)]'>
      <div className='text-center'>
        <div className="flex flex-col">
          <h1 className="font-semibold">Welcome,</h1>
          <h1 className="font-extrabold">{userDetail.fullname}</h1>

          <Button
            className="mt-6"
            type="submit"
            variant="secondary"
            onClick={navigateMyLog}
          >Activity Log</Button>

          <Button
            className="mt-6"
            type="submit"
            variant="secondary"
            onClick={navigateTasks}
          >Tasks List</Button>

          <Button
            className="mt-6"
            type="submit"
            onClick={onLogout}
          >Logout</Button>
        </div>
      </div>
    </main>
  )
}

export default Home



// import { useContext, useEffect, useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { useNavigate } from 'react-router-dom'
// import { AuthContext } from '../auth/AuthContext'
// import { getAuth, signOut } from 'firebase/auth'
// import './Home.css'
// import { doc, getDoc } from 'firebase/firestore'
// import { db } from '@/repository/firebase/config'

// export interface UserDetail {
//   fullname: string;
//   employee_id: string;
//   email: string;
//   createdAt: Number;
// }


// function Home() {
//   const navigate = useNavigate()
//   const { user } = useContext(AuthContext);
//   const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
//   let accDetail: any = {}



//   useEffect(() => {
//     if (!user) {
//       console.log("User not logged in");
//       navigate('/', { replace: true })
//     } else {
//       getAccountDetail(user.uid)
//         .then(data => {
//           accDetail = data
//           setUserDetail(accDetail)
//           console.log("Account Detail", accDetail)
//         })
//         .catch(error => {
//           console.log("Error getting account detail", error)
//         })
//     }
//   }, [user, navigate])

//   // useEffect(() => {
//   //   const unsubscribe = onAuthStateChanged(auth, (user) => {
//   //     if (user) {
//   //       console.log("user persist")
//   //       setUser(user);
//   //     } else {
//   //       console.log("user not persist")
//   //       setUser(null);
//   //     }
//   //   });
//   //   return () => unsubscribe();
//   // }, [auth])

//   if (!user) {
//     console.log("PUser not logged in");
//     return <div>Redirecting...</div>
//   }


//   async function getAccountDetail(userId: string) {
//     try {
//       const docRef = doc(db, `users-activity/${userId}/account/account-detail`)
//       const docSnap = await getDoc(docRef)

//       if (docSnap.exists()) {
//         console.log("Document data:", docSnap.data())
//         return docSnap.data()
//       } else {
//         console.log("No such document!")
//         return null
//       }
//     } catch (error) {
//       console.log("Error getting account detail", error)

//     }
//   }

//   async function onLogout() {
//     console.log("Logout Clicked")
//     const auth = getAuth();
//     signOut(auth).then(() => {
//       console.log("Logged out successfully")
//       navigate('/')
//     }).catch((error) => {
//       console.log("Error logging out", error)
//     })

//   }

//   async function navigateMyLog() {
//     navigate('/mylog')
//   }

//   async function navigateTasks() {
//     navigate('/tasks')
//   }

//   return (
//     <main className='flex items-center justify-center min-h-[calc(80vh-64px)]'>
//       <div className='text-center'>
//         <div
//           className="flex flex-col "
//         >
//           <h1
//             className="font-semibold"
//           >Welcome,</h1>
//           <h1
//             className="font-extrabold "
//           >{userDetail?.fullname}</h1>

//           <Button
//             className="mt-6"
//             type="submit"
//             variant="secondary"
//             onClick={() => navigateMyLog()}
//           >Activity Log</Button>

//           <Button
//             className="mt-6"
//             type="submit"
//             variant="secondary"
//             onClick={() => navigateTasks()}
//           >Tasks List</Button>
//           <Button
//             className="mt-6"
//             type="submit"
//             onClick={() => onLogout()}
//           >Logout</Button>
//         </div>

//       </div>
//     </main>

//   )
// }

// export default Home