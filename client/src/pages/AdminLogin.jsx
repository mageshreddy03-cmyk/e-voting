import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const API = "http://localhost:5000";
export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)


  const login = async (e) => {
    e.preventDefault()
    const { username, password } = form
    console.log(username, password);
    try {
      setLoading(true)
      const res = await axios.post(`${API}/admin-login`, form);
      localStorage.setItem("admin", JSON.stringify(res.data));
      toast.success("Login Success 🔥");
      navigate("/admin-dashboard");
      setLoading(false)
    } catch (error) {
      console.log(error);

      toast.error(error.status == 401 && "Invalid Credentials" || error.message);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("admin"))) {
      navigate("/admin-dashboard")
    }
  }, [])

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-black text-white">
      <div className="md:min-w-xl mx-auto bg-gray-900 border border-white/10 p-5 rounded">
        <h1 className="text-center">Admin Login</h1>
        <form onSubmit={login} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username <span className="text-red-500">*</span></label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} id="username" type="text" className="border border-white/10 p-2 outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password <span className="text-red-500">*</span></label>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} id="password" type="password" className="border border-white/10 p-2 outline-none" />
          </div>
          <button
            onClick={login}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/40"
              }`}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}