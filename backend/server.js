import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import mysql from "mysql";

const secretKey = "helloWorld";
const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "bankjwt",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  }
});

function generateAccessToken(userId) {
  return jwt.sign(userId, secretKey);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, secretKey, (err, userId) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.userId = userId;
    next();
  });
}

app.post("/users", (req, res) => {
  const { username, password, amount = 100 } = req.body;

  connection.query(
    "INSERT INTO users (username, password) VALUES (?,?)",
    [username, password],
    (err, results) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      const userId = results.insertId;
      connection.query(
        "INSERT INTO accounts (user_id, amount) VALUES (?,?)",
        [userId, amount],
        (err, results) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }

          res.sendStatus(201);
        }
      );
    }
  );
});

app.post("/sessions", (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      const dbUser = results[0];
      if (dbUser !== null && dbUser.password === password) {
        const token = generateAccessToken(dbUser.id);
        console.log(dbUser);
        res.json({ token });
        console.log(token);
      } else {
        res.sendStatus(401);
      }
    }
  );
});

app.get("/me/accounts", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM accounts WHERE user_id = ?",
    [req.userId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      const money = results[0].amount;
      res.json(money);
    }
  );
});
