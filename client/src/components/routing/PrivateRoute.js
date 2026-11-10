import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user, status } = useAuth();
    if (status === "checking") return <p role="status">Checking session...</p>;
    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
