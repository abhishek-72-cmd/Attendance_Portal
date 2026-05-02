import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    manager_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { value: "EMPLOYEE", label: "Employee" },
    { value: "MANAGER", label: "Manager" },
    { value: "HR", label: "HR" },
  ];

  const handleRegister = async () => {
    setError("");

    // 🔴 Basic validation
    if (!form.name || !form.email || !form.password) {
      return setError("All required fields must be filled");
    }

    try {
      setLoading(true);

      // ✅ FIX ALL DATA ISSUES HERE
      const payload = {
        ...form,
        manager_id:
          form.manager_id === "" ? null : Number(form.manager_id),
      };

      console.log("FINAL PAYLOAD:", payload);

      await API.post("/auth/register", payload);

      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Registration failed. Please check inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 px-4 py-10">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          />

          {/* Role */}
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value} className="text-black">
                {r.label}
              </option>
            ))}
          </select>

          {/* Manager ID */}
          <input
            placeholder="Manager ID (optional)"
            value={form.manager_id}
            onChange={(e) =>
              setForm({ ...form, manager_id: e.target.value })
            }
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </div>

        <p className="mt-4 text-center text-slate-300">
          Already have account?{" "}
          <Link to="/" className="text-purple-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}