const express = require('express');
const app = express();
const path = require('path');

// TELLING BROWSER HOW TO PARSE THE BODY WHEN POSTING
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// USING THE STATIC METHOD TO TELL US THAT WE ARE GOING THROUGH PUBLIC FOLDER TO GET EVERYTHING
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

// SAVED PROJECTS
app.locals.projects = [
  // { id: 'a1', project: 'Palette Picker'}
];

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});

app.get('/api/v1/projects', (request, response) => {
  // RETRIEVE ALL PROJECTS
  // if (project) { return response.status(200).json(project) }
  response.json(app.locals.projects);
});

// DYNAMIC END POINT
app.get('/api/v1/projects/:id', (request, response) => {
  // RETRIEVE ALL PROJECTS
  const { id } = request.params;
  // FIND THE PROJECT THAT MATCHES THE ID
  const { project } = app.locals.projects.find(project => project.id === id);
  // if (project) { return response.status(200).json(project) }
  // else return response.sendStatus(404) (NOT FOUND);
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { palettes } = request.body;
  // RETRIEVE ALL PALETTES FOR THAT PROJECT
});

app.post('/api/v1/projects', (request, response) => {
  const { project } = request.body;
});
// CREATE A NEW PROJECT
// if (!project) {
// return response.status(422).send({
// error: 'no project property provided' }
//});
// else - push into an array, and:
// return response.status(201).json({ id, project })

app.post('/api/vi/palettes', (request, response) => {
  const { palette } = request.body;
  // CREATE NEW PALETTE
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  // DELETE palette
  // IF ID DOESNT MATCH:
  // response.status(404).({ error: 'no matching palettes' })
  // IF ID DOES MATCH:
  // response.sendStatus(204)

});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});
