import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

// const { DATABASE_URL, PORT } = .env;

const app = express();

const PORT = 4000;




const db = new pg.Pool({
    // connectionString: process.env.DATABASE_URL,
    user: "leo",
    host: "localhost",
    database: 'todo',
    password: "Uglyg00d",
    port: "5432"
});

db.connect();

db.query(`SELECT * FROM TODO`, (err, res) => {
    if (!err) {
        console.log(res.rows)
    } else {
        throw err;
    }
})

app.use(express.static("./public"));
app.use(express.json());
app.use(cors());
console.log("hello");
// app.get
app.get("/api/todo", (_, res) => {
    console.log('first get req');
    try {
        db.query("SELECT * FROM todo").then((data) => {
            res.json(data.rows);
        });

    } catch (error) {
        console.log(error)
    }
});


app.get("/api/todo/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.sendStatus(422);
        return;
    }
    db.query("SELECT * FROM todo WHERE id = $1", [id]).then((result) => {
        if (result.rows.length === 0) {
            res.sendStatus(404, "in the get req failed");
        } else {
            res.send(result.rows[0]);
        }
    });
});



app.delete("/api/todo/:id", (req, res) => {
    const id = req.params.id;

    if (Number.isNaN(Number(id))) {
        res.sendStatus(422);
        return;
    }

    const query = "DELETE FROM todo WHERE id = $1 RETURNING *";
    const values = [id];

    db.query(query, values)
        .then((data) => {
            console.log("hello");
            if (data.rows.length === 0) {
                res.sendStatus(404); // Not Found
            } else {
                res.sendStatus(204); // No Content
            }
        })
        .catch((error) => {
            console.error("Error executing DELETE query:", error);
            res.sendStatus(500); // Internal Server Error
        });
});


app.patch("/api/todo/:id", (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    db.query("UPDATE todo SET text = $1 WHERE id = $2 RETURNING *", [
        text,
        id,
    ]).then((data) => {
        res.send(data.rows[0]);
    });
});

app.post("/api/todo", (req, res) => {
    const { text } = req.body;
    db.query("INSERT INTO todo (text) VALUES ($1) RETURNING *", [
        text
    ]).then((result) => {
        res.send(result.rows[0]);
    })
});


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})