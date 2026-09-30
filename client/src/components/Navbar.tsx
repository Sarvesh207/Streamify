import { useState } from "react";
import {
  Menu,
  Search,
  Video,
  EllipsisVertical,
  User,
  LogOut,
  Settings,
  ChartNoAxesCombined
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { removeUser } from "../store/slices/userSlice";
import { logoutUser } from "../api/user.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userLogOutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      dispatch(removeUser());
      setIsProfileOpen(false);
      navigate("/");
      toast.success(data?.message ?? "User Logout");
    },
    onError: (error) => {
      dispatch(removeUser());
      setIsProfileOpen(false);
      toast.error(error.message);
    },
  });

  function handleLogout() {
    userLogOutMutation.mutate();
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-black border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 rounded-full hover:bg-gray-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 text-black bg-white rounded-xl">
              <Video className="w-5 h-5 fill-current" />
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-white sm:block font-display">
              VStream
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden max-w-2xl flex-1 mx-8 md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="search"
              className="block w-full p-2.5 pl-10 text-sm text-white bg-[#1a1a1a] border border-gray-800 rounded-full focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-gray-500 outline-none transition-all"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search Icon */}
          <button className="p-2 text-gray-400 rounded-full md:hidden hover:bg-gray-800">
            <Search className="w-6 h-6" />
          </button>

          <button className="p-2 text-gray-400 rounded-full hover:bg-gray-800">
            <EllipsisVertical className="w-6 h-6" />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-10 h-10 overflow-hidden  rounded-full focus:ring-1 focus:ring-white/20 focus:outline-none"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar?.url}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-black border border-gray-800 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-4 border-b border-gray-800">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-xs font-medium text-gray-400 truncate mt-1">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg border border-transparent hover:bg-gray-900 hover:text-white hover:border-gray-800 transition-all duration-200 group"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
                      Profile
                    </Link>

                    <Link
                      to="/analytics"
                      className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg border border-transparent hover:bg-gray-900 hover:text-white hover:border-gray-800 transition-all duration-200 group"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ChartNoAxesCombined className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
                      Analytics
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg border border-transparent hover:bg-gray-900 hover:text-white hover:border-gray-800 transition-all duration-200 group"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg border border-transparent hover:bg-gray-900 hover:text-white hover:border-gray-800 transition-all duration-200 group text-left"
                    >
                      <LogOut className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-full hover:bg-gray-800"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Log in</span>
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-[#2a2a2a] rounded-full hover:bg-[#3f3f3f]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
