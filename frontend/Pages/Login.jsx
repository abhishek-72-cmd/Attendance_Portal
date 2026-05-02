import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Safe JWT Decode
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogin = async () => {
    setError("");

    // ✅ Basic validation
    if (!email || !password) {
      return setError("Email and Password are required");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      const token = res.data.token;

      if (!token) {
        throw new Error("Invalid response from server");
      }

      // ✅ Decode safely
      const decoded = parseJwt(token);

      if (!decoded || !decoded.role) {
        throw new Error("Invalid token");
      }

      console.log("DECODED:", decoded);

      // ✅ Store consistent user object
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(decoded));

      const role = decoded.role;

      // ✅ Correct role-based routing (CASE SENSITIVE)
      if (role === "HR") {
        navigate("/hr");
      } else if (role === "MANAGER") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }

    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-10 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
              <span className="text-white text-2xl font-bold">L</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-300 text-sm mt-1">
              Sign in to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-100 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">

            {/* Email */}
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-16 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-300">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}