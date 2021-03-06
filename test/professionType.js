var mongoose     = require("mongoose");
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Profession   = require('../models/professionType');
//Require the dev-dependencies
var chai         = require('chai');
var chaiHttp     = require('chai-http');

// Add promise support if this does not exist natively.

//chai.use(chaiAsPromised);
chai.use(chaiHttp);

var should = chai.should();

//For work whit environment variable.
require('dotenv').config();

var server  = process.env.API_LOCALHOST;

describe('Professions', () => {
    beforeEach(() => {
        Profession.remove({}, (err) => { 
           done();         
        });
    });
  describe('/GET professions', () => {
      it('it should GET all the professions', () => {
             chai.request(server)
            .get(process.env.API_RESOURCE)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(0);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });

  describe('/POST profession', () => {
      it('when missing item in payload, should return a 400 ok response and a single error', () => {
        var profession = {
                code: "MEDICO"
            }
            chai.request(server)
            .post(process.env.API_RESOURCE)
            .send(profession)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.have.property('description');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            })
      });
      it('it should POST a profession ', () => {
        var profession = {
                code: "MEDICO",
                description: "Medico"
            }
            chai.request(server)
            .post(process.env.API_RESOURCE)
            .send(profession)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').eql('Profession successfully added!');
                expect(res.body.profession).to.have.property('code');
                expect(res.body.profession).to.have.property('description');
                expect(res.body.profession).to.have.property('enabled');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });
  describe('/GET/:id profession', () => {
      it('it should GET a profession by the given id', () => {
        var profession = new Profession({ 
                              code: "WEBADMIN",
                              description: "Administrador web"
                            });
        profession.save((err, profession) => {
            chai.request(server)
            .get(process.env.API_RESOURCE + '/' + profession.id)
            .send(profession)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.profession).to.have.property('code');
                expect(res.body.profession).to.have.property('description');
                expect(res.body.profession).to.have.property('enabled');
                expect(res.body).to.have.property('_id').eql(profession.id);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
        });

      });
  });
  describe('/PUT/:id profession', () => {
      it('it should UPDATE a profession given the id', () => {
        var profession = new Profession({ 
                            code: "MEDICOP",
                            description: "Medico pediatra"
                            })
        profession.save((err, profession) => {
                chai.request(server)
                .put(process.env.API_RESOURCE + '/' + profession.id)
                .send({ code: "MEDICOP",
                        description: "Medico pediatrico"
                    })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('Profession successfully updated.');
                    expect(res.body.profession).to.have.property('description').eql("Medico pediatrico");
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id profession', () => {
      it('it should DELETE a profession given the id', () => {
        var profession = new Profession({  
                            code: "MAS",
                            description: "Masajista"
                            })
        profession.save((err, profession) => {
                chai.request(server)
                .DELETE(process.env.API_RESOURCE + '/' + profession.id)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('Profession successfully deleted.');
                    expect(res.body.result).to.have.property('ok').eql(1);
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
});