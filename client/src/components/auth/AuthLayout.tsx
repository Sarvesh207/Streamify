import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/user.api";
import { addUser, removeUser } from "../../store/slices/userSlice";
import { Loader2 } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await getUser();
                if (currentUser?.data) {
                    dispatch(addUser(currentUser.data));
                } else {
                    dispatch(removeUser());
                }
            } catch (error) {
                dispatch(removeUser());
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthLayout;
