const express = require("express");
const cors = require('cors');

const app = express();

const db = require("./models")

const { User } = require("./models")
const { Publication } = require("./models")

app.use(express.json());
app.use(cors())

app.get("/", (request, response) => {
    response.json("hello, this is the backend")
});

app.post("/create", (request, response) => {
    Publication.create({
        student_id: request.body.authorID,
        title: request.body.title,
        year: request.body.year
    }).catch(err => {
        if (err) {
            console.log(err);
            response.send(err);
        }
    })
    response.send("Successfully added publication")
});

app.get("/publications", (request, response) => {
    Publication.findAll({
        attributes: ['id', 'title', 'year'],
        include: [{
                model: User,
                as: 'student',
                attributes: ['first_name', 'last_name'],
                required: true,
        }]
    }).then((publications) => {
        const results = publications.map(pub => ({
            id: pub.id,
            title: pub.title,
            year: pub.year,
            first_name: pub.student.first_name,
            last_name: pub.student.last_name,
          }));

        response.send(results);
    }).catch(err => {
        if (err) {
            console.log(err);
            response.send(err);
        }
    })
});

app.get("/authors", (request, response) => {
    User.findAll().then(users => response.send(users)).catch(err => {
        if (err) {
            console.log(err);
            response.send(err);
        }
    })
});

app.post("/update", (request, response) => {
    Publication.update({
        title: request.body.title,
        year: request.body.year
    },
    {
        where: {
            id: request.body.id
        }
    }).then(([affectedRows]) => {
        response.send("Successfully updated publications");
    }).catch(err => {
        if (err) {
            console.log(err);
            response.send(err);
        }
    })
})

app.post("/delete", (request, response) => {
    Publication.destroy({
        where: {
            id: request.body.id,
        }
    }).then((deletedRows) => {
        response.send("Successfully deleted publication")
    }).catch(err => {
        if (err) {
            console.log(err);
            response.send(err);
        }
    })
});

app.post("/create", (request, response) => {
    Publication.create({
        student_id: request.body.authorID,
        title: request.body.title,
        year: request.body.year
    }).catch(err => {
        if (err) {
            console.log(err);
            response.send(err);
        }
    });

    response.send("Successfully added publication");
})

db.sequelize.sync().then(request => {

    app.listen(8800, () => {
        console.log("Connected to backend")
    })
})
