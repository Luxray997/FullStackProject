import express from "express";
import mysql from "mysql";
import cors from 'cors';

const app = express();

const dataBase = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "abcd",
        database: "test"
});

app.use(express.json());
app.use(cors())

app.get("/", (request, response) => {
    response.json("hello, this is the backend")
})

app.get("/publications", (request, response) => {
    const query = "SELECT p.id, title, year, first_name, last_name FROM publications p JOIN users u ON p.student_id = u.id";
    dataBase.query(query, (error, data) => {
        if (error) return response.status(500).json({error: "Error", details: error});
        return response.json(data);
    })
})

app.get("/authors", (request, response) => {
    const query = "SELECT * from users";
    dataBase.query(query, (error, data) => {
        if (error) return response.status(500).json({error: "Error", details: error});
        return response.json(data);
    })
})

app.post("/update", (request, response) => {
    const query = `UPDATE publications SET title = \"${request.body.title}\", year = ${request.body.year} WHERE id = ${request.body.id}`;
    
    dataBase.query(query, function (err, res) {
        if (err) return response.status(500).json({error: "Error", details: err});
        return response.json("Successfully updated publication")
    })

});

app.post("/delete", (request, response) => {
    const query = `DELETE FROM publications WHERE id = ${request.body.id}`

    dataBase.query(query, function (err, res) {
        if (err) return response.status(500).json({error: "Error", details: err});
        return response.json("Successfully deleted publication")
    })
})

app.post("/create", (request, response) => {
    const query = `INSERT INTO publications (student_id, title, year) VALUES (${request.body.authorID}, \"${request.body.title}\", ${request.body.year})`

    dataBase.query(query, function (err, res) {
        if (err) return response.status(500).json({error: "Error", details: err});
        return response.json("Successfully added publication")
    })
})

app.listen(8800, () => {
    console.log("Connected to backend")
})