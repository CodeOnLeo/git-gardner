import {createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/authenticated",{
            credentials: "include",
        }).then(res => {
            if(res.ok){
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        })
            .catch(() => setIsAuthenticated(false));
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};