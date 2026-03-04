import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API = "http://localhost:5000";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    party_id: "",
    constituency_id: "",
  });

  // Fetch candidates
  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get(`${API}/all-candidates`);
    setCandidates(res.data);
    setLoading(false)
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Party Name
  const getParty = (id) => {
    if (id == 1) return "TVK";
    if (id == 2) return "DMK";
    if (id == 3) return "ADMK";
    return "Unknown";
  };

  // Constituency Name
  const getConstituency = (id) => {
    if (id == 1) return "Lalgudi";
    if (id == 2) return "Dindigul";
    if (id == 3) return "Madurai";
    return "Unknown";
  };

  // Open Edit
  const handleEditClick = (candidate) => {
    setSelected(candidate);
    setForm(candidate);
    setEditOpen(true);
  };

  // Update Candidate
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API}/admin/update-candidate/${selected.id}`,
        form
      );
      toast.success("Candidate updated successfully");
      setEditOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Open Delete
  const handleDeleteClick = (candidate) => {
    setSelected(candidate);
    setDeleteOpen(true);
  };

  // Confirm Delete
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API}/admin/delete-candidate/${selected.id}`
      );
      toast.success("Candidate deleted successfully");
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

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
    <div className="p-4 sm:p-6">

      {/* Heading */}
      <div className="flex justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Candidate List
        </h2>
        <span className="text-sm text-gray-500">
          Total: {candidates.length}
        </span>
      </div>

      {/* Grid */}
      {
        loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white shadow-md hover:shadow-xl rounded-2xl p-5 transition border border-gray-100"
              >
                <div className="mb-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    🏛 {partyMap[candidate.party_id] || "Independent"}
                  </p>
                  <p className="text-sm text-gray-500">
                    📍 {constituencyMap[candidate.constituency_id] || "Unknown"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(candidate)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteClick(candidate)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* ================= EDIT MODAL ================= */}
      {editOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Edit Candidate
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="number"
                value={form.party_id}
                onChange={(e) =>
                  setForm({ ...form, party_id: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="number"
                value={form.constituency_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    constituency_id: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM ================= */}
      {deleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this candidate?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="flex-1 bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Yes Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateList;