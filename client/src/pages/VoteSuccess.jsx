import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function VoteSuccess() {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false)
      navigate("/results")
    }, 7000);
    return () => clearTimeout(timeout)
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      {show && <Confetti />}
      <h1 className="text-4xl font-bold">Vote Successful 🎉</h1>
      <button
        onClick={() => navigate("/results")}
        className="mt-6 bg-white text-black px-6 py-2 rounded-xl"
      >
        View Results
      </button>
    </div>
  );
}