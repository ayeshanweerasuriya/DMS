const express = require("express");
const cors = require("cors");
const app = express();

app.listen(8000);

// middleware
app.use(cors());
app.use(express.json());

app.use("/", (req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.json({ msg: "succes" });
});
