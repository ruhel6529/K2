import {Link} from "react-router-dom";
import {useAuth} from "@/context/Auth";

const ProtectedRoute = ({ children }: any) => {
    const { user } = useAuth()

    if (!user) {
        // user is not authenticated
        return <Link to="/Login" />;
    }
    return <>{children}</>
};

export default ProtectedRoute