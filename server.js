/*eslint-disable max-len*/
/*eslint-disable no-console*/


// REQUIRE express - library on top of node that makes it easier to read, write, and maintain node.js
const express = require('express');

// REQUIRE body-parser - makes it possible for posts to be read by the server
const bodyParser = require('body-parser');

//EXPRESS - initiate app
const app = express();

// ENV - sets the environemnt to node environment if it is declared with process.env, otherwise defaults to to development
const environment = process.env.NODE_ENV || 'development';

// REQUIRE - applies knexfile to the current environment
const configuration = require('./knexfile')[environment];

// REQUIRE - initiates a database and brings in knex to the configured environment
const database = require('knex')(configuration);

// MIDDLEWARE - tells the browser to expect json and parse the body when posting
app.use(bodyParser.json());
// MIDDLEWARE - tells the browser to parse the urlencoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');

// SET - the port environment to the port based on the environemtn or defaults to port 3000
app.set('port', process.env.PORT || 3000);
// SET - title of the app
app.locals.title = 'Palette Picker';
// USES - the static elements of the app (html, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// RETRIEVE - if static elements (html, css, js) aren't there, this is sent as the response
app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});

// RETRIEVES - all projects from the database, via this endpoint
app.get('/api/v1/projects', (request, response) => {
  // GRABS - the projects table from the database
  database('projects').select()
    // GOOD RESPONSE - if there are projects in the database and the request is successful, the response sends the data to the client with a succees status
    .then(projects => {
      return response.status(200).json(projects);
    })
    // BUMMER RESPONSE - if the request fails, a 500 status, there is an issue with the server, is returned to the client
    .catch(error => {
      return response.status(500).json({ error });
    });
});

// RETRIEVES - a specific project that matches the id in the dynamic endpoint
app.get('/api/v1/projects/:id', (request, response) => {
  // GRABS - and assigns a variable to the id from the dynamic route
  const { id } = request.params;
  // SELECT - id from the projects database that matches the one in the dynamic route
  database('projects').where('id', id).select()
    // GOOD RESPONSE - if there's a project, return the project and a success status to the client
    .then((project) => {
      if (project.length) {
        return response.status(200).json(project);
      }
      // NOT FOUND - if the project doesn't exist, return a 404 not found response, and include the requested id, to the client
      return response.status(404)
        .json({ error: `Could not locate project with id: ${id}` });
    })
    // BUMMER RESPONSE - if the request fails, a 500 status, there is an issue with the server, is returned to the client
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

// RETRIEVES - a specific palette that belongs to the project of the id in the dynamic endpoint
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  // GRABS - and assigns a variable to the id from the dynamic route
  const { id } = request.params;

  // SELECT - id from the palettes database that matches the one in the dynamic route
  database('palettes').where('project_id', id ).select()
    // GOOD RESPONSE - if there are palettes, return the palette and a success status to the client
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      }
      // NOT FOUND - if the palette doesn't exist, return a 404 not found response, and include the requested id, to the client
      return response.status(404).json({
        error: `Could not locate palettes for project with id: ${id}`
      });
    })
    // BUMMER RESPONSE - if the request fails, a 500 status, there is an issue with the server, is returned to the client
    .catch(error => {
      return response.status(500).json({ error });
    });
});

// RETRIEVES - a specific palette from the palettes database that matches the id in the dynamic endpoint
app.get('/api/v1/palettes/:id', (request, response) => {
  // GRABS - and assigns a variable to the id from the dynamic route
  const { id } = request.params;
  // SELECT - id from the palettes database that matches the one in the dynamic route
  database('palettes').where('id', id).select()
    // GOOD RESPONSE - if there are palettes, return the palette and a success status to the client
    .then(palette => {
      if (palette.length) {
        return response.status(200).json(palette);
      }
    })
    // BUMMER RESPONSE - if the request fails, a 500 status, there is an issue with the server, is returned to the client
    .catch(error => {
      return response.status(500).json({ error });
    });
});

// ADDS - a new projects to the projects database
app.post('/api/v1/projects', (request, response) => {
  // GRABS - info (for the project to be added) from the body of the client request and assigns it a variable
  const project = request.body;
  // LOOP FOR INFO - and checks to make sure the required info is included
  for (let requiredParameter of ['project_title']) {
    // MISSING INFO - request is missing required information
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }
  // ADD PROJ - all required information is present and project is added to the database
  database('projects').insert(project, '*')
    // GOOD RESPONSE - if there are projects to be added, add the project and return a success status to the client
    .then(project => {
      return response.status(201).json(project);
    })
    // BUMMER RESPONSE - if the request fails, a 500 status, there is an issue with the server, is returned to the client
    .catch(error => {
      return response.status(500).json({ error });
    });
});

// ADDS - a new palette to the palettes database
app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  // GRABS - and assigns a variable to the id from the dynamic route
  const { id } = request.params;
  // LOOP FOR INFO - and checks to make sure the required info is included
  for (let requiredParameter of [
    'palette_title',
    'hex_code_1',
    'hex_code_2',
    'hex_code_3',
    'hex_code_4',
    'hex_code_5'
  ]) {
    // MISSING INFO - request is missing required information
    if (!palette[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }
  // NEW OBJ - if all requred info is present, it is added to a new object that can be added to the server
  palette = Object.assign({}, palette, { project_id: id });
  // ADD PALETTE - all required information is present and palette is added to the database
  database('palettes').insert(palette, '*')
    // GOOD RESPONSE - if there are palettes to be added, add the palette and return a success status to the client
    .then(palette => {
      return response.status(201).json(palette);
    })
    // BUMMER RESPONSE - if the request fails, a 500 status, there is an issue with the server, is returned to the client
    .catch(error => {
      return response.status(500).json({ error });
    });
});

// DESTROYS - a palette, matching the dynamic route id, from the databse
app.delete('/api/v1/palettes/:id', (request, response) => {
  // GRABS - and assigns a variable to the id from the dynamic route
  const { id } = request.params;

  // DESTROY - palette from the palettes database that matches the id of the one in the dynamic route
  database('palettes').where({ id }).del()

    .then(palette => {
      // DESTROY SUCCESS - if there is a palette to delete, delete it and send a successful response status to the client
      if (palette) {
        return response.sendStatus(204);
      }
      // NOT FOUND - if the palette is missing, send a response that the palette was not found
      return response.status(422).json({ error: 'Not Found' });
    })

    // BUMMER RESPONSE - if the request fails, a 500 status, there is an issue with the server, is returned to the client
    .catch(error => {
      return response.status(500).json({ error });
    });
});

// LISTEN - server is listening for requests from the indidcated port
app.listen(app.get('port'), () => {
  // LOG - lets developer know it's running
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// EXPORT - file for testing
module.exports = app;
