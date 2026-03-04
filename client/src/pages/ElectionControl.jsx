import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API = "http://localhost:5000";

function ElectionControl() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(status);
  

  // Fetch current status
  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API}/admin/election-status`);
      setStatus(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true);
      await axios.put(`${API}/admin/election-status`, {
        status: newStatus,
      });

      setStatus(newStatus);
      toast.success("Election status updated");
      setLoading(false);
    } catch (err) {
      toast.error("Update failed");
      setLoading(false);
    }
  };

  const getButtonStyle = (buttonStatus, color) => {
    const base =
      "px-6 py-3 rounded-lg text-white transition w-full md:w-auto";

    if (status === buttonStatus) {
      return `${base} ${color} ring-4 ring-offset-2 ring-black scale-105`;
    }

    return `${base} ${color} opacity-70 hover:opacity-100`;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Election Status
      </h2>

      {/* Current Status Badge */}
      <div className="mb-6 space-x-2">
        <span className="text-lg text-gray-600">Current Status:</span>
        <div className="mt-2 inline-block px-4 py-1 rounded-full bg-gray-100 font-semibold">
          {status || "Loading..."}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          disabled={loading}
          onClick={() => updateStatus("ACTIVE")}
          className={getButtonStyle(
            "ACTIVE",
            "bg-green-500 hover:bg-green-600"
          )}
        >
          Activate
        </button>

        <button
          disabled={loading}
          onClick={() => updateStatus("INACTIVE")}
          className={getButtonStyle(
            "INACTIVE",
            "bg-yellow-500 hover:bg-yellow-600"
          )}
        >
          Deactivate
        </button>

        <button
          disabled={loading}
          onClick={() => updateStatus("RESULT_PUBLISHED")}
          className={getButtonStyle(
            "RESULT_PUBLISHED",
            "bg-red-500 hover:bg-red-600"
          )}
        >
          Publish Results
        </button>
      </div>
    </div>
  );
}

export default ElectionControl;