import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Analyzer" },
    { path: "/history", label: "History" },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl shadow-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gray-900 p-2 rounded-full border border-gray-800 group-hover:border-emerald-500/50 transition-colors">
                  <span className="text-xl">🌳</span>
                </div>
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                  CarbonCode
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wider">
                  AI INFRASTRUCTURE AUDITOR
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-2"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg border border-emerald-500/30"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 font-medium transition-all duration-300 ${
                        isActive
                          ? "text-emerald-300"
                          : "text-gray-400 hover:text-emerald-300"
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full -translate-x-1/2"
                        layoutId="navbar-underline"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* User & Logout - Desktop */}
              {user ? (
                <div className="flex items-center gap-3 ml-4">
                  {/* User Profile */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-emerald-500/30 transition-all duration-300 cursor-default">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
                          <span className="text-white font-bold text-sm">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">
                          {user.name?.split(" ")[0] ||
                            user.email?.split("@")[0]}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">
                          {user.email}
                        </p>
                      </div>

                      {/* Logout Button in Pill */}
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="ml-2 group relative px-4 py-2 bg-gradient-to-r from-rose-600/20 to-rose-500/20 hover:from-rose-600/40 hover:to-rose-500/40 text-rose-300 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 border border-rose-500/30 hover:border-rose-400/50 flex items-center gap-2 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/25 overflow-hidden"
                        title="Sign out of CarbonCode"
                      >
                        <motion.div
                          className="w-5 h-5 flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                        </motion.div>
                        <span>Logout</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
                      </button>
                    </div>
                  </motion.div>

                  {/* Primary CTA */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/dashboard"
                      className="group relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg font-semibold text-white shadow-lg shadow-emerald-500/25 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center space-x-2">
                        <span className="text-lg">⚡</span>
                        <span>Start Audit</span>
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ) : (
                // Login Button for non-authenticated users
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-4"
                >
                  <Link
                    to="/auth"
                    className="group relative px-6 py-2.5 bg-linear-to-r from-emerald-600 to-cyan-600 rounded-lg font-semibold text-white shadow-lg shadow-emerald-500/25 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <span className="relative flex items-center space-x-2">
                      <span className="text-lg">🚀</span>
                      <span>Get Started</span>
                    </span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              {user && (
                <motion.div whileTap={{ scale: 0.95 }} className="mr-2">
                  <Link
                    to="/dashboard"
                    className="group relative px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg font-semibold text-white shadow-lg shadow-emerald-500/25 overflow-hidden text-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center space-x-1">
                      <span className="text-base">⚡</span>
                      <span>Audit</span>
                    </span>
                  </Link>
                </motion.div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-emerald-500/50 transition-colors relative z-50"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <motion.span
                    className="w-6 h-0.5 bg-gray-300 block rounded-full"
                    animate={
                      isMobileMenuOpen
                        ? { rotate: 45, y: 5 }
                        : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="w-6 h-0.5 bg-gray-300 block rounded-full mt-1"
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="w-6 h-0.5 bg-gray-300 block rounded-full mt-1"
                    animate={
                      isMobileMenuOpen
                        ? { rotate: -45, y: -5 }
                        : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      </nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 max-w-md w-full overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-rose-900/20 rounded-xl">
                      <ArrowRightEndOnRectangleIcon className="w-7 h-7 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Logout</h3>
                      <p className="text-gray-400">Ready to leave?</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {user?.name || user?.email?.split("@")[0]}
                        </p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm">
                      You'll be signed out and redirected to the home page.
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-800 flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-300 border border-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
                  >
                    <motion.div className="w-5 h-5">
                      <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                    </motion.div>
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl shadow-emerald-900/20 z-40 md:hidden"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Menu Header */}
                <div className="flex items-center justify-between mb-8 pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-75" />
                      <div className="relative bg-gray-900 p-2 rounded-full border border-gray-800">
                        <span className="text-xl">🌳</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        CarbonCode
                      </h2>
                      <p className="text-xs text-gray-400">
                        AI INFRASTRUCTURE AUDITOR
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* User Info - Mobile */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">
                          {user.name || user.email?.split("@")[0]}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full px-5 py-4 bg-gradient-to-r from-rose-600/20 to-rose-500/20 hover:from-rose-600/40 hover:to-rose-500/40 text-rose-300 hover:text-white rounded-xl font-semibold text-base transition-all duration-400 border border-rose-500/30 hover:border-rose-400/50 flex items-center justify-center gap-3 shadow-xl shadow-rose-500/15 hover:shadow-rose-500/30 transform hover:-translate-y-0.5"
                      title="Sign out securely"
                    >
                      <motion.div
                        className="w-6 h-6 flex-shrink-0"
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <ArrowRightEndOnRectangleIcon className="w-6 h-6" />
                      </motion.div>
                      <span>Sign Out Securely</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-all duration-700 -translate-x-10 hover:translate-x-10" />
                    </button>
                  </motion.div>
                )}

                {/* Menu Items */}
                <nav className="space-y-1 flex-1">
                  {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`relative block px-4 py-3 rounded-lg transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300"
                              : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-lg">
                              {item.label}
                            </span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                              />
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile CTA Button */}
                {!user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-6 border-t border-gray-800"
                  >
                    <Link
                      to="/auth"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group relative w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/25 overflow-hidden flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center justify-center space-x-3 py-1">
                        <span className="text-lg">🚀</span>
                        <span className="text-base">Get Started</span>
                      </span>
                    </Link>
                  </motion.div>
                )}

                {/* Footer Text */}
                <div className="pt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Optimize your code's carbon footprint
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
