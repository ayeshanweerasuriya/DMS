const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/auth/staff-login", (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === "staff" && password === "password") {
      console.log(username, password);
      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/doctor-login", (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === "doctor" && password === "password") {
      console.log(username, password);
      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
