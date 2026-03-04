import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function ResultsPage() {
    const [status, setStatus] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get(`${API}/public/results`);

                setStatus(res.data.status);

                // Normalize vote field safely
                const normalized = (res.data.results || []).map((c) => ({
                    ...c,
                    votes: Number(c.totalvotes ?? c.totalVotes ?? 0),
                }));

                setResults(normalized);
            } catch (err) {
                console.error("Error fetching results:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    // =============================
    // LOADING STATE
    // =============================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <p className="text-xl animate-pulse">Fetching Results...</p>
            </div>
        );
    }

    // =============================
    // STATUS BASED UI
    // =============================
    if (status === "ACTIVE") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
                <h1 className="text-4xl font-bold text-green-500">
                    🟢 Election is Live
                </h1>
                <p className="text-gray-400 mt-4">
                    Voting is currently in progress...
                </p>
            </div>
        );
    }

    if (status === "INACTIVE") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
                <h1 className="text-4xl font-bold text-yellow-500">
                    ⏳ Election Not Started
                </h1>
                <p className="text-gray-400 mt-4">
                    Please wait until the election becomes active.
                </p>
            </div>
        );
    }

    // =============================
    // RESULTS PUBLISHED UI
    // =============================

    return (
        <div className="min-h-screen bg-slate-900 text-white p-10">
            <h1 className="text-4xl font-bold text-center mb-3">
                🏆 Election Results
            </h1>

            <p className="text-center text-green-400 mb-10">
                🔴 Election has Ended
            </p>

            <div className="overflow-x-auto md:max-w-6xl mx-auto">
                <table className="w-full text-left border-collapse rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="bg-white/10 text-gray-300">
                            <th className="p-4">Name</th>
                            <th className="p-4">Party</th>
                            <th className="p-4">Constituency</th>
                            <th className="p-4">Total Votes</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.map((candidate, index) => {
                            // Since backend ORDER BY totalVotes DESC
                            const isWinner = index === 0;

                            return (
                                <motion.tr
                                    key={candidate.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`transition-all duration-300 ${
                                        isWinner
                                            ? "bg-green-600/20 border-l-4 border-green-500 scale-[1.01]"
                                            : "bg-white/5 hover:bg-white/10"
                                    }`}
                                >
                                    <td className="p-4 font-semibold">
                                        {candidate.name}
                                    </td>

                                    <td className="p-4 text-gray-300">
                                        {candidate.party}
                                    </td>

                                    <td className="p-4 text-gray-400">
                                        {candidate.constituency}
                                    </td>

                                    <td className="p-4 font-bold text-lg">
                                        {candidate.votes.toLocaleString()}
                                    </td>

                                    <td className="p-4">
                                        {isWinner ? (
                                            <span className="bg-green-500 px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                Winner 🏆
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">
                                                -
                                            </span>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-12">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="px-8 py-3 bg-blue-700 rounded-xl hover:bg-blue-800 transition-all shadow-lg"
                >
                    Dashboard
                </button>
            </div>
        </div>
    );
}