import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = () => {
    const user = useSelector((state: any) => state.user);

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoutes;
