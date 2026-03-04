import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useEffect } from "react";

const API = "http://localhost:5000";

export default function Login() {
    const [form, setForm] = useState({ voter_id: "", password: "" });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const login = async () => {
        try {
            setLoading(true)
            const res = await axios.post(`${API}/login`, form);
            localStorage.setItem("user", JSON.stringify(res.data));
            toast.success("Login Success 🔥");
            navigate("/dashboard");
            setLoading(false)
        } catch {
            toast.error("Invalid Credentials");
            setLoading(false)
        }
    };

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("user"))) {
            navigate("/dashboard")
        }
    }, [])

    return (
        <div className="p-5 min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-gray-900 to-black relative overflow-hidden">

            {/* Background Glow Effect */}
            <div className="absolute w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full -top-25 -left-25" />
            <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full -bottom-25 -right-25" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 
                 shadow-2xl p-10 rounded-3xl w-95 text-white"
            >
                <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">
                    🗳 Voter Login
                </h2>

                {/* Voter ID */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        required
                        className="peer w-full bg-white/10 p-4 rounded-xl outline-none 
                     focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder=" "
                        onChange={(e) =>
                            setForm({ ...form, voter_id: e.target.value })
                        }
                    />
                    <label className="absolute left-4 top-4 text-gray-400 text-sm 
                          peer-placeholder-shown:top-4 
                          peer-placeholder-shown:text-base
                          peer-placeholder-shown:text-gray-500
                          peer-focus:-top-5 peer-focus:text-sm 
                          peer-focus:text-indigo-400
                          transition-all">
                        Voter ID
                    </label>
                </div>

                {/* Password */}
                <div className="relative mb-8">
                    <input
                        type="password"
                        required
                        className="peer w-full bg-white/10 p-4 rounded-xl outline-none 
                     focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder=" "
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                    <label className="absolute left-4 top-4 text-gray-400 text-sm 
                          peer-placeholder-shown:top-4 
                          peer-placeholder-shown:text-base
                          peer-placeholder-shown:text-gray-500
                          peer-focus:-top-5 peer-focus:text-sm 
                          peer-focus:text-indigo-400
                          transition-all">
                        Password
                    </label>
                </div>

                {/* Button */}
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

                {/* Small Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Secure Voting System 🔐
                </p>
            </motion.div>
        </div>
    );
}