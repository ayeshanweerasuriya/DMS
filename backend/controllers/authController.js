const createUser = (req, res) => {
  const { displayname, username, password } = req.body;

  if (username === "username") {
    return res.status(409).json({ error: "username is already exist" });
  }

  res.status(201).json({
    message: "User created successfully",
    displayname,
    username,
    password,
  });
};

const getUser = (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.json({ mssg: "username or password is not defined" });
  }

  res.send({
    mssg: "User logged in Successfully!",
    id,
    password,
  });
};

module.exports = { createUser, getUser };
