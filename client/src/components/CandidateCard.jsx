import { motion } from "framer-motion";
import { Vote, CheckCircle } from "lucide-react";

export default function CandidateCard({ data, onVote, hasVoted }) {
  console.log(data);
  const partyMap = {
    1: "TVK",
    2: "DMK",
    3: "ADMK",
  };

  const constituencyMap = {
    1: "Chennai Central",
    2: "Chennai South",
    3: "Madurai",
    4: "Coimbatore",
    5: "Trichy",
    6: "Salem",
    7: "Erode",
    8: "Vellore",
    9: "Tirunelveli",
    10: "Thanjavur",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.3 }}
      className="relative bg-linear-to-br from-white/5 to-white/10 
                 backdrop-blur-xl border border-white/10
                 rounded-3xl p-8 shadow-2xl overflow-hidden"
    >
      {/* Accent Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-green-500/10 to-transparent opacity-30 pointer-events-none"></div>

      {/* Party Badge */}
      <span className="absolute top-4 right-4 bg-indigo-600/80 text-xs px-3 py-1 rounded-full font-medium tracking-wide">
        {partyMap[data.party_id] || "Independent"}
      </span>

      {/* Avatar */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-500 to-emerald-700 
                        flex items-center justify-center text-2xl font-bold shadow-lg mb-4">
          {data.name.charAt(0)}
        </div>

        <h2 className="text-2xl font-semibold">{data.name}</h2>

        {data.constituency_id && (
          <p className="text-gray-400 text-sm mt-1">
            📍 {constituencyMap[data.constituency_id] || "Unknown"}
          </p>
        )}
      </div>

      {/* Vote Button */}
      <div className="mt-8">
        <button
          onClick={() => onVote(data.id)}
          disabled={hasVoted}
          className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-semibold 
            transition-all duration-300 ${hasVoted
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/40"
            }`}
        >
          {hasVoted ? (
            <>
              <CheckCircle size={18} />
              Already Voted
            </>
          ) : (
            <>
              <Vote size={18} />
              Cast Vote
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}