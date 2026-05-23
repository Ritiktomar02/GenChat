import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Home } from "lucide-react";
import UserContext from "../context/UserContext";
import Logo from "./Logo";

const getInitials = (user) => {
  if (user?.picture && !user.picture.startsWith("http")) return user.picture;
  return user?.username?.charAt(0).toUpperCase() || "?";
};

const Avatar = ({ user, size = "w-8 h-8", textSize = "text-sm" }) => {
  const isUrl = user?.picture?.startsWith("http");
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`${size} rounded-full overflow-hidden bg-emerald-600 flex items-center justify-center shrink-0`}
    >
      {isUrl && !imgError ? (
        <img
          src={user.picture}
          alt={user.username}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={`${textSize} font-bold text-white`}>
          {getInitials(user)}
        </span>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 w-full bg-gray-900/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Logo className="size-5 sm:size-6 text-emerald-400" />
            <span className="text-base sm:text-lg font-bold text-white">GenChat</span>
          </button>

          {location.pathname !== "/" && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">Projects</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar user={user} size="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="text-sm text-gray-300 hidden md:block">
              {user?.username}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export { Avatar };
export default Navbar;
