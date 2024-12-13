import {createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/authenticated", {
            credentials: "include",
        })
            .then(async (res) => {
                const isAuth = await res.json();
                setIsAuthenticated(isAuth);
            })
            .catch((err) => {
                setIsAuthenticated(false);
            });
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};