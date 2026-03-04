import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CandidateCard from "../components/CandidateCard";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

export default function Dashboard() {
    const [candidates, setCandidates] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [candidateLoading, setCandidateLoading] = useState(true);
    const [voteStatusLoading, setVoteStatusLoading] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const pageLoading = candidateLoading || voteStatusLoading;


    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setCandidateLoading(true);
                const res = await axios.get(`${API}/all-candidates`);
                setCandidates(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setCandidateLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const [status, setStatus] = useState("")

    const fetchStatus = async () => {
        const res = await axios.get(`${API}/public/results`);

        setStatus(res.data.status);
    }

    useEffect(() => {
        fetchStatus()
    }, [])



    useEffect(() => {
        const fetchVoteStatus = async () => {
            try {
                setVoteStatusLoading(true);
                const res = await axios.get(`${API}/single-citizen/${user.id}`);
                setHasVoted(res.data.has_voted);
            } catch (err) {
                console.log(err);
            } finally {
                setVoteStatusLoading(false);
            }
        };

        fetchVoteStatus();
    }, []);




    const vote = async (id) => {
        console.log(id);

        await axios.post(`${API}/vote`, {
            voter_id: user.voter_id,
            candidate_id: id,
        });
        navigate("/success");
    };

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("user"))) {
            navigate("/")
        }
    }, [user])

    const logout = async () => {
        localStorage.removeItem("user");
        toast.success("Logout successfull...")
        navigate("/")
    }

    const RESULT_PUBLISHED = () => {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
                <h1 className="text-4xl font-bold text-green-500">
                    🏆 Result is Published
                </h1>
                <Link to={"/results"} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    View Results
                </Link>
            </div>
        );
    }

    const INACTIVE = () => {
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


    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-900 to-black text-white p-5">

            {/* Top Bar */}
            <div className="flex justify-between items-center px-5 py-6 border-b border-white/10">
                <h1 className="text-lg md:text-2xl font-semibold tracking-wide">
                    🗳 Welcome, <span className="text-green-400">{user.name}</span>
                </h1>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 md:px-4 md:py-2 px-3 py-1   rounded-xl transition-all"
                >
                    Logout
                    <LogOut className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            {
                status === "INACTIVE" ? (
                    <INACTIVE />
                ) : status === "ACTIVE" ? (
                    pageLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto my-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {candidates.map((c) => (
                                <CandidateCard
                                    key={c.id}
                                    data={c}
                                    onVote={vote}
                                    hasVoted={hasVoted}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <RESULT_PUBLISHED/>
                )
            }
        </div>
    );
}