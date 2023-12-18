const express = require("express");
const morgan = require("morgan");

morgan.token("body", function (request, response) {
  return JSON.stringify(request.body);
});

const app = express();
app.use(express.json());
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

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  );
});
const generateId = () => {
  return Math.floor(Math.random() * 100);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const nameExist = persons.some((person) => person.name === body.name);
  if (!body.name) {
    return response.status(400).json({ error: "name is missing" });
  } else if (!body.number) {
    return response.status(400).json({ error: "number is missing" });
  } else if (nameExist) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
