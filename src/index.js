const express = require('express');
const cors = require('cors');
const { v4: uuidv4, validate: uuidValidate } = require('uuid'); //importando segundo a documentação

const app = express();

app.use(cors());
app.use(express.json());

const projects = [];

//Middleware de interrupção
function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); //tiro o return para ele executar o código abaixo

    console.timeEnd(logLabel);
}

function validadeProjectId(request, response, next) {
    const { id } = request.params;

    if (!uuidValidate(id)) {
        return response.status(400).json({ error: 'Invalid project ID.' })
    }

    return next();
}

//Usando o middleware
app.use(logRequests);
app.use('/projects/:id', validadeProjectId);

//rota GET
app.get('/projects', (request, response) => {
    const { title } = request.query;

    const result = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(result);
});

//rota POST
app.post('/projects', (request, response) => {

    const { title, owner } = request.body;

    const project = { id: uuidv4(), title, owner };

    projects.push(project);

    return response.json(project);
});

//rota PUT
app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found' })
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

//rota DELETE
app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found' })
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

//rota para a porta do localhost
app.listen(3333, () => {
    console.log(' Back-end started!  ✔')
});