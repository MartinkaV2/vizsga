import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const FILE = "./quizzes.json";

// GET - összes teszt
app.get("/api/quizzes", (req, res) => {
  if (!fs.existsSync(FILE)) return res.json([]);

  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

// POST - új teszt
app.post("/api/quizzes", (req, res) => {
  let data = [];

  if (fs.existsSync(FILE)) {
    data = JSON.parse(fs.readFileSync(FILE));
  }

  const newQuiz = {
    id: Date.now(),
    name: req.body.name,
    data: req.body.data
  };

  data.push(newQuiz);
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.json(newQuiz);
});

app.listen(3000, () => console.log("Server fut: 3000"));