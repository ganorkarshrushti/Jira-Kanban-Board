const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "", 
    database: "kanban_db", 
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to MySQL database!");
});

// API Routes
app.get("/tickets", (req, res) => {
    db.query("SELECT * FROM tickets", (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.post("/tickets", (req, res) => {
    const { text, date, status } = req.body;
    db.query(
        "INSERT INTO tickets (text, date, status) VALUES (?, ?, ?)",
        [text, date, status],
        (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).send("Ticket added!");
            }
        }
    );
});

app.put("/tickets/:id", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    db.query(
        "UPDATE tickets SET status = ? WHERE id = ?",
        [status, id],
        (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send("Ticket updated!");
            }
        }
    );
});

app.delete("/tickets/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tickets WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("Ticket deleted!");
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
