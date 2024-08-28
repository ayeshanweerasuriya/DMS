const express = require("express");
const cors = require("cors");
const AuthRouter = require("./routes/auth/auth.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method + " - " + req.url);
  next();
});

app.use("/auth", AuthRouter);

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port:`, PORT);
});
