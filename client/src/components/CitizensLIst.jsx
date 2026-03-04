import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API = "http://localhost:5000";

export default function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const res = await axios.get(`${API}/citizens`);
        setCitizens(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch citizens"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCitizens();
  }, []);

  const filteredCitizens = citizens.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-xl animate-pulse">Loading Citizens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        🧾 Citizen List
      </h1>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-w-4xl mx-auto">
        <table className="w-full border-collapse rounded-2xl overflow-hidden backdrop-blur-lg">
          <thead>
            <tr className="bg-white/10 text-gray-300 text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Voter Id</th>
              <th className="p-4">constituency_id</th>
            </tr>
          </thead>

          <tbody>
            {filteredCitizens.map((citizen, index) => (
              <motion.tr
                key={citizen.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/5 hover:bg-white/10 transition-all"
              >
                <td className="p-4 font-medium">{citizen.id}</td>
                <td className="p-4">{citizen.name}</td>
                <td className="p-4 text-gray-300">
                  {citizen.voter_id || "-"}
                </td>
                <td className="p-4 text-gray-400">
                  {citizen.constituency_id || "-"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredCitizens.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No matching citizens found.
          </p>
        )}
      </div>
    </div>
  );
}