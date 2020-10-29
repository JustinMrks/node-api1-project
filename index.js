const express = require("express");

const generate = require("shortid").generate;

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5555;

let users = [
  {
    id: generate(), // hint: use the shortid npm package to generate it
    name: "Justin Marks", // String, required
    bio: "Wow, now that is one handsome fellow", // String, required
  },
];

app.post(`/api/users`, (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      const newUser = { id: generate(), name, bio };
      users.push(newUser);
      res.status(200).json(newUser);
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});

app.get(`/api/users`, (req, res) => {
  try {
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});

app.get(`/api/users/:id`, (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  try {
    if (!user) {
      res.status(404).json({
        message: `The user with the specified ID ${id} does not exist.`,
      });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  }
});

app.delete(`/api/users/:id`, (req, res) => {
  const { id } = req.params;
  try {
    if (!users.find((user) => user.id === id)) {
      res.status(404).json({
        message: `The user with the specified ID ${id} does not exist.`,
      });
    } else {
      users = users.filter((user) => user.id !== id);
      res
        .status(200)
        .json({ message: `Successfully deleted user with ID: ${id}` });
    }
  } catch (errors) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});

app.put(`/api/users/:id`, (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const userIndex = users.findIndex((user) => user.id === id);
  try {
    if (!users.find((user) => user.id === id)) {
      res.status(404).json({
        message: `The user with the specified ID ${id} does not exist.`,
      });
    } else if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      users[userIndex] = { id, name, bio };
      res.status(200).json({ id, name, bio });
    }
  } catch (errors) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Not found!" });
});

// 6- LISTEN FOR INCOMING REQUESTS
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
