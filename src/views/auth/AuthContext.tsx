import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();
  const contextValue = useMemo(() => ({ user }), [user]);
  useEffect(() => {
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     setUser(user ? null);
    //   } else {
    //     setUser(null);
    //   }
    // })

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user as User) {
        setUser(user);
      } else {
        setUser(null);
      }

    },
      (error) => {
        setUser(null);
        console.error(error);
      });


    // const unsubscribe = onAuthStateChanged((authUser) => {
    //   if (authUser) {
    //     setUser(authUser);
    //   } else {
    //     setUser(null);
    //   }
    // });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
