import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password
      });
      localStorage.setItem("token", data.token);
      setUser(data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="w-full max-w-md bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl p-8 border border-purple-200 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-800"> Welcome Back</h2>
        {error && <p className="text-rose-600 mb-6 text-center bg-rose-50 p-4 rounded-xl border border-rose-200">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" Email Address"
              className="w-full px-4 py-4 bg-white text-gray-700 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all shadow-sm"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" Password"
              className="w-full px-4 py-4 bg-white text-gray-700 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all shadow-sm"
              required
            />
          </div>
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 font-semibold transition-all transform hover:scale-105 shadow-lg">
             Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link className="text-purple-600 hover:text-purple-700 font-semibold transition-colors" to="/register">
             Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;