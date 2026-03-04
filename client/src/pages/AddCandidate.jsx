import axios from "axios";
import { lazy, useState } from "react";
import { toast } from 'react-hot-toast'
const API = 'http://localhost:5000'
function AddCandidate() {
  const [form, setForm] = useState({ name: "", party_id: "", constituency_id: "" })
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${API}/admin/add-candidate`, form)
      if (res.status == 200) {
        toast.success("Candidate added successfully")
      }
      setLoading(false)
      setForm({ name: "", party_id: "", constituency_id: "" })
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Add Candidate</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Candidate Name"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          value={form.party_id}
          onChange={(e) => setForm({ ...form, party_id: e.target.value })}
          placeholder="Party ID"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          value={form.constituency_id}
          onChange={(e) => setForm({ ...form, constituency_id: e.target.value })}
          placeholder="Constituency ID"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          {loading ? "adding..." : "Add Candidate"}
        </button>
      </form>
    </div>
  );
}

export default AddCandidate;