import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import cors from "cors";
//Configuration
dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Check the Value
if (!process.env.DATABASE_URL) {
  throw new Error("URL is NOT read");
}

//DB Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // important for Neon
  },
});

//get All citizens
app.get("/citizens", async (req, res) => {
  const citizens = await pool.query("SELECT * FROM citizens");
  if (citizens.rowCount === 0) {
    return res.status(404).json({ message: "No Citizens Found!" });
  }

  res.json(citizens.rows);
});

/* Citizen Login */
app.post("/login", async (req, res) => {
  const { voter_id, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM citizens WHERE voter_id=$1 AND password=$2",
    [voter_id, password],
  );

  if (user.rows.length === 0)
    return res.status(401).json({ message: "Invalid credentials" });

  res.json(user.rows[0]);
});

//Get All Candidates
app.get("/all-candidates", async (req, res) => {
  const candidates = await pool.query("SELECT * FROM candidates");
  res.json(candidates.rows);
});

//Get Single citizen data
app.get("/single-citizen/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const citizen = await pool.query("SELECT * FROM citizens WHERE id=$1", [id]);

  if (!citizen.rows.length === 0) {
    return res.status(404).json({ message: "Citizen not found" });
  }

  res.json(citizen.rows[0]);
});

/* Vote */
app.post("/vote", async (req, res) => {
  const { voter_id, candidate_id } = req.body;

  if (typeof candidate_id !== "number") {
    return res.status(400).json({ message: "Invalid candidate id" });
  }
  const user = await pool.query("SELECT * FROM citizens WHERE voter_id=$1", [
    voter_id,
  ]);
  if (user.rows.length === 0) {
    return res
      .status(404)
      .json({ message: "The voter not exist in the vote list" });
  }

  const result = await pool.query("SELECT * FROM candidates WHERE id = $1", [
    candidate_id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  const candidate = result.rows[0];

  if (user.rows[0].has_voted) return res.json({ message: "Already voted" });

  const constituency_id = user.rows[0].constituency_id;

  await pool.query(
    "INSERT INTO votes(candidate_id,constituency_id) VALUES($1,$2)",
    [candidate.id, constituency_id],
  );

  await pool.query("UPDATE citizens SET has_voted=true WHERE voter_id=$1", [
    voter_id,
  ]);

  res.json({ message: "Vote Successful" });
});

//ADMIN CONTROL----------------------------------------------------------------------------------------------------------

//Admin Login
app.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  console.log(username, password);
  console.log("username", process.env.ADMIN_USERNAME);
  console.log("password", process.env.ADMIN_PASSWORD);

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  res.status(200).json({ message: "Login successfully..." });
});

//Add Candidate
app.post("/admin/add-candidate", async (req, res) => {
  const { name, party_id, constituency_id } = req.body;

  await pool.query(
    "INSERT INTO candidates (name, party_id, constituency_id) VALUES ($1,$2,$3)",
    [name, party_id, constituency_id],
  );

  res.json({ message: "Candidate added successfully" });
});

//Update Candidate
app.put("/admin/update-candidate/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const { name, party_id, constituency_id } = req.body;
  console.log(name, party_id, constituency_id);

  if (!name || !party_id || !constituency_id) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const result = await pool.query(
      `UPDATE candidates
       SET name = $1,
           party_id = $2,
           constituency_id = $3
       WHERE id = $4
       RETURNING *`,
      [name, party_id, constituency_id, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({
      message: "Candidate updated successfully",
      candidate: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Delete Candidate
app.delete("/admin/delete-candidate/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM candidates WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({
      message: "Candidate deleted successfully",
      candidate: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Control election status
app.put("/admin/election-status", async (req, res) => {
  const { status } = req.body; // ACTIVE / INACTIVE / RESULT_PUBLISHED

  await pool.query("UPDATE election_settings SET status=$1 WHERE id=1", [
    status,
  ]);

  res.json({ message: "Election status updated" });
});

//Get election status
app.get("/admin/election-status", async (req, res) => {
  const data = await pool.query(
    "SELECT status FROM election_settings WHERE id=1",
  );

  res.json(data.rows[0].status);
});

//Results Endpoint
app.get("/public/results", async (req, res) => {
  try {
    // Get election status
    const statusResult = await pool.query(
      "SELECT status FROM election_settings WHERE id = 1",
    );

    const status = statusResult.rows[0].status;

    // If results not published, don't send results
    if (status !== "RESULT_PUBLISHED") {
      return res.json({
        status,
        results: [],
      });
    }

    // Fetch results
    const results = await pool.query(`
      SELECT
  c.id,
  c.name,
  p.name AS party,
  ct.name AS constituency,
  COUNT(v.id) AS totalVotes
  FROM candidates c
  JOIN parties p ON c.party_id = p.id
  JOIN constituencies ct ON c.constituency_id = ct.id
  LEFT JOIN votes v ON v.candidate_id = c.id
  GROUP BY c.id, c.name, p.name, ct.name
  ORDER BY totalVotes DESC;
    `);

    res.json({
      status,
      results: results.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.use((err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal server Error" });
});

//Server Listen
app.listen(5000, () => {
  pool
    .connect()
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("DB not Connected: ", err));

  console.log("Server running on 5000");
});
