import {useAuth} from "../context/AuthContext";
import {Navigate} from "react-router-dom";

const PrivateRoute = ({children}) => {
    const {isAuthenticated} = useAuth();

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;