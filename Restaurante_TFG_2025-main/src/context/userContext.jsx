import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();


export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  
  const login = (userData) => {
    localStorage.setItem("usuario", JSON.stringify(userData));
    setUsuario(userData);
  };


  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    };
    
    const isAuthenticated = usuario !== null 
 
  return (
    <UserContext.Provider value={{ usuario, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  return useContext(UserContext);
}
