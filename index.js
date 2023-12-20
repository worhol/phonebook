require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("body", function (request, response) {
  return JSON.stringify(request.body);
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(morgan(":method :url :status :response-time :body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  );
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const nameExist = persons.some((person) => person.name === body.name);
  if (body.name === undefined) {
    return response.status(400).json({ error: "name is missing" });
  } else if (body.number === undefined) {
    return response.status(400).json({ error: "number is missing" });
  } else if (nameExist) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
