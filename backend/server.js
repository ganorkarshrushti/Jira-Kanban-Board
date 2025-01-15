
// 1...
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

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
// api Routes
app.get("/tickets", (req, res) => {
    db.query("SELECT id, text, status, created_at FROM tickets", (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results); //created at in db
        }
    });
});
app.post("/tickets", (req, res) => {
    const { text, status } = req.body; 
    console.log("Received POST data:", req.body); // Log the incoming data 

    if (!text || !status) {
        return res.status(400).send("Missing required fields: text or status.");
    }
    db.query(
        "INSERT INTO tickets (text, status, created_at) VALUES (?, ?, NOW())",  //curr time dt using now()f
        [text, status],
        (err, result) => {
            if (err) {
                console.error("Error inserting ticket into database:", err); 
                return res.status(500).send("Failed to add ticket.");
            }
            console.log("Ticket successfully added:", result);
            res.status(201).json({ id: result.insertId, text, status }); 
        }
    );
});
app.put("/tickets/:id", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    db.query(
        "UPDATE tickets SET status = ? WHERE id =?",
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




//9 jan-this is the updated 3.27pm ,with add ticket button working properly
/*const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
//app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
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
    db.query("SELECT id, text, status FROM tickets", (err, results) => { // Removed date
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});
app.post("/tickets", (req, res) => {
    const { text, status } = req.body; // Extract the ticket data from the request
    console.log("Received POST data:", req.body); // Log the incoming data for debugging

    if (!text || !status) {
        return res.status(400).send("Missing required fields: text or status.");
    }

    db.query(
        "INSERT INTO tickets (text, status) VALUES (?, ?)", // Insert ticket into the database
        [text, status],
        (err, result) => {
            if (err) {
                console.error("Error inserting ticket into database:", err); // Log the error
                return res.status(500).send("Failed to add ticket.");
            }
            console.log("Ticket successfully added:", result);
            res.status(201).json({ id: result.insertId, text, status }); // Send a success response
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
*/





//old-without dates
/*
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
    db.query("SELECT id, text, status FROM tickets", (err, results) => { // Removed date
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.post("/tickets", (req, res) => {
    const { text, status } = req.body; // Removed date
    db.query(
        "INSERT INTO tickets (text, status) VALUES (?, ?)", // Removed date from query
        [text, status],
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
*/


