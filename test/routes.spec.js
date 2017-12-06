
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then((response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('Palette Picker');
      })
      .catch((error) => {
        throw error;
      });
  });
  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      });
  });
});


describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
  });

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      chai.request(server)
        .get('/api/v1/projects')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('project_title');
          response.body[0].name.should.equal('Project 1');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
        })
        .catch((error) => {
          throw error;
        });
    });

    it('should return a 404 if the path is incorrect', (done) => {
      chai.request(server)
        .get('/api/v1/wrong')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return all palettes for a specific project', () => {
      chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[1].should.have.property('id');
          response.body[1].id.should.equal(2);
          response.body[1].should.have.property('palette_title');
          response.body[1].name.should.equal('Rainbow');
          response.body[1].should.have.property('hex_code_1');
          response.body[1].hex_code_1.should.equal('#FFBE0B');
          response.body[1].should.have.property('hex_code_2');
          response.body[1].hex_code_2.should.equal('#FB5607');
          response.body[1].should.have.property('hex_code_3');
          response.body[1].hex_code_3.should.equal('#FF006E');
          response.body[1].should.have.property('hex_code_4');
          response.body[1].hex_code_4.should.equal('#8338EC');
          response.body[1].should.have.property('hex_code_5');
          response.body[1].hex_code_5.should.equal('#3A86FF');
          response.body[1].should.have.property('project_id');
          response.body[1].project_id.should.equal(1);
          response.body[1].should.have.property('created_at');
          response.body[1].should.have.property('updated_at');
        })
        .catch((error) => {
          throw error;
        });
    });

    it('should return a 404 if the path is incorrect', (done) => {
      chai.request(server)
        .get('/api/v1/wrongo')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a specific palette', () => {
      chai.request(server)
        .get('/api/v1/palettes/2')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[2].should.have.property('id');
          response.body[2].id.should.equal(2);
          response.body[2].name.should.equal('Climbing');
          response.body[2].should.have.property('hex_code_1');
          response.body[2].hex_code_1.should.equal('#002626');
          response.body[2].should.have.property('hex_code_2');
          response.body[2].hex_code_2.should.equal('#0E4749');
          response.body[2].should.have.property('hex_code_3');
          response.body[2].hex_code_3.should.equal('#95C623');
          response.body[2].should.have.property('hex_code_4');
          response.body[2].hex_code_4.should.equal('#E55812');
          response.body[2].should.have.property('hex_code_5');
          response.body[2].hex_code_5.should.equal('#EFE7DA');
          response.body[2].should.have.property('project_id');
          response.body[2].project_id.should.equal(1);
          response.body[2].should.have.property('created_at');
          response.body[2].should.have.property('updated_at');
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should be able to add a project to database', (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 2,
          project_title: 'project2'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          chai.request(server)
            .get('/api/v1/projects')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.length.should.equal(2);
              done();
            });
        });
    });

    it('should not create a project with missing data', (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 2
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
    });
  });

  describe('POST /api/v1/projects/:id/palettes/', () => {
    it('should send and add a new palette to database', () => {
      chai.request(server)
        .post('/api/v1/projects/1/palettes')
        .send({
          id: 3,
          palette_title: 'Bluetiful',
          hex_code_1: '#BEE9E8',
          hex_code_2: '#62B6CB',
          hex_code_3: '#1B4965',
          hex_code_4: '#CAE9FF',
          hex_code_5: '#5FA8D3',
          project_id: 1
        })
        .then((response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(3);
          response.body[0].should.have.property('palette_title');
          response.body[0].name.should.equal('Bluetiful');

          chai.request(server)
            .get('/api/v1/projects/1/palettes')
            .then((getResponse) => {
              getResponse.should.have.status(200);
              getResponse.should.be.json;
              getResponse.body.should.be.a('array');
              getResponse.body.length.should.equal(3);
              getResponse.body[2].should.have.property('id');
              getResponse.body[2].id.should.equal(3);
              getResponse.body[2].should.have.property('palette_title');
              getResponse.body[2].name.should.equal('Bluetiful');
              getResponse.body[2].should.have.property('hex_code_1');
              getResponse.body[2].hex_code_1.should.equal('#BEE9E8');
              getResponse.body[2].should.have.property('hex_code_2');
              getResponse.body[2].hex_code_2.should.equal('#62B6CB');
              getResponse.body[2].should.have.property('hex_code_3');
              getResponse.body[2].hex_code_3.should.equal('#1B4965');
              getResponse.body[2].should.have.property('hex_code_4');
              getResponse.body[2].hex_code_4.should.equal('#CAE9FF');
              getResponse.body[2].should.have.property('hex_code_5');
              getResponse.body[2].hex_code_5.should.equal('#5FA8D3');
              getResponse.body[2].should.have.property('project_id');
              getResponse.body[2].project_id.should.equal(1);
              getResponse.body[2].should.have.property('created_at');
              getResponse.body[2].should.have.property('updated_at');
              // done();
            })
            .catch((error) => {
              throw error;
            });
        });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {

    it('should delete a palette from database', (done) => {
      chai.request(server)
        .delete('/api/v1/palettes/1')
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('should return a 422 error if the palette is not found', (done) => {
      chai.request(server)
        .delete('/api/v1/palettes/500')
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Not Found');
          done();
        });
    });
  });
});
