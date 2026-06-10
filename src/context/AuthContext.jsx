import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Arun Kumar',
    email: 'arun@example.com',
    goal: 'Lose weight',
    dailyCalorieGoal: 2000,
    weight: 79,
    targetWeight: 74,
    height: 175,
    age: 28,
  })
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const login = (userData) => { setUser(userData); setIsAuthenticated(true) }
  const logout = () => { setUser(null); setIsAuthenticated(false) }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
