const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
// TELLING BROWSER HOW TO PARSE THE BODY WHEN POSTING
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// USING THE STATIC METHOD TO TELL US THAT WE ARE GOING THROUGH
//PUBLIC FOLDER TO GET EVERYTHING
app.use(express.static(__dirname + '/public'));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});

app.get('/api/v1/projects', (request, response) => {
  // RETRIEVE ALL PROJECTS
  database('projects').select()
    .then(projects => {
      return response.status(200).json(projects);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const projectId = request.params.id;

  database('palettes').where('project_id', projectId ).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(404).json({
          error: `Unable to retrieve project with id: ${projectId}`
        });
      }
    })
    .then(error => {
      return response.status(500).json({ error });
    });
});


// DYNAMIC END POINT
app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).select()
    .then(palette => {
      if (palette.length) {
        return response.status(200).json(palette);
      } else {
        return response.status(404).json({
          error: `Unable to find palette with id :${id}`
        });
      }
    })
    .then(error => {
      return response.status(500).json({ error });
    });
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
