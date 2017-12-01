/*eslint-disable max-len*/

// REQUIRE express -
// library on top of node that makes it easier to read, write, and maintain node.js
const express = require('express');

// REQUIRE body-parser - makes it possible for posts to be read by the server
const bodyParser = require('body-parser');

//EXPRESS - initiate app
const app = express();

// ENV -
//sets the environemnt to node environment if it is declared with process.env, otherwise defaults to to development
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

// SET - the port environment to the cariable port or default to port 3000
app.set('port', process.env.PORT || 3000);
// SET - title of the app
app.locals.title = 'Palette Picker';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});


app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json(projects);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;

  database('projects').where('id', id).select()
    .then((project) => {
      if (project.length) {
        return response.status(200).json(project);
      }
      return response.status(404)
        .json({ error: `Could not locate project with id: ${id}` });
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;

  database('palettes').where('project_id', id ).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(200).json([]);
      }
    })

    .then(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).select()
    .then(palette => {
      if (palette.length) {
        return response.status(200).json(palette);
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['project_title']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  database('projects').insert(project, '*')
    .then(project => {
      return response.status(201).json(project);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const { id } = request.params;

  for (let requiredParameter of [
    'palette_title',
    'hex_code_1',
    'hex_code_2',
    'hex_code_3',
    'hex_code_4',
    'hex_code_5'
  ]) {
    if (!palette[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  palette = Object.assign({}, palette, { project_id: id });

  database('palettes').insert(palette, '*')
    .then(palette => {
      return response.status(201).json(palette);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});


app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where({ id }).del()
    .then(palette => {
      if (palette) {
        return response.sendStatus(204);
      } else {
        return response.status(422).json({ error: 'Not Found' });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});


app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
