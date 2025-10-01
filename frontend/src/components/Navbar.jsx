import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    if (!user) return;
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/");
    }, 500);
    return () => clearTimeout(delay);
  }, [search, navigate, user]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white shadow-2xl">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold text-white hover:text-purple-100 transition-colors"> Notes App</Link>
        {user && (
          <>
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder=" Search your notes..."
                className="w-full px-4 py-3 bg-white bg-opacity-90 text-gray-700 border-2 border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 placeholder-gray-500 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-purple-100 font-medium"> {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-rose-600 hover:to-pink-600 font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                 Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;