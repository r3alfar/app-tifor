import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/repository/firebase/config';
import { Outlet, useLocation, Navigate } from 'react-router-dom';

// custom hook to manage authentication state
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    //cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
}


// protectedRoute component that guard routes requiring authentication
// interface ProtectedRouteProps {
//   component: React.ComponentType<any>;
// }
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <Outlet />
}

// function ProtectedRoute() {
//   return (
//     <div>ProtectedRoute</div>
//   )
// }

export default ProtectedRoute