const app = require("../app.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
const jwt = require('jsonwebtoken')
const User = require("../models/userModel");

chai.use(chaiHttp);

// ======================= ARTICLES
const Article = require('../models/articleModel')

const userDataDummy = {
    _id : '',
    username: 'agung',
    email : 'agung@mail.com',
    password : 'asdasd123',
    token : ''
}

describe('Articles Route', function() {
    beforeEach(function () {
        let dataNewUser = {
          username: "agung",
          email: "agung@mail.com",
          password: "asdasd123"
        }
  
        let user = new User(dataNewUser)
  
        return new Promise(resolve => {
          user.save().then(data => {
            userDataDummy._id = data._id
            userDataDummy.token = jwt.sign({
              id: data._id,
              username: data.username
            }, process.env.JWT_SECRET)
            resolve()
          }).catch(err=>{
              console.log(err)
          })
        })
  
    });

    afterEach(function () {
        User.deleteOne({email:'agung@mail.com'}).then(data => {})
    })
    describe('Create Article', function () {
            
        it(' POST on URL : /articles', function (done) {
            chai.request(app)
            .post('/articles')
            .set("authorization", `Bearer ${userDataDummy.token}`)
            .send({
                title: 'Testing Dev',
                content: `It's all about testing driven development`
            })
            .end(function (err, res) {     
                expect(res).to.have.status(201);
                expect(res.body.status).to.equal('success');
                expect(res.body.message).to.equal('success when creating article');
                done()
            });
        });
    });
    
    describe('Update Article by Id', function () {
    
      before(function (done) {
          let newArticle = {
              title : 'Test Driven Development',
              author : userDataDummy._id,
              content : 'Testing app to make sure all code run properly'
          }
          let article = new Article(newArticle)
      
          article.save()
          .then(data => { 
              userDataDummy.ArticleDummyId = data._id
              done()
          })
          .catch(err => {
              done()
              console.log('\n> error when creating article\n');
          })
      })
    
      it(' PUT on URL : /articles/:id', function (done) {
          
          chai.request(app)
          .put(`/articles/${userDataDummy.ArticleDummyId}`)
          .set("authorization", `Bearer ${userDataDummy.token}`)
          .send({
              title: 'Testing Driven Dev',
              content: `It's all about testing driven development`
          })
          .end(function (err, res) {
              expect(res).to.have.status(200);
              expect(res.body.status).to.equal('success');
              expect(res.body.message).to.equal('sucess when update article');
              done()
          });
      });
    });
    
    describe('Find All Article', function () {
    
      it(' GET on URL : /articles', function (done) {
          chai.request(app)
          .get('/articles')
          .end(function (err, res) {   
              expect(res).to.have.status(200);
              expect(res.body.status).to.equal('success');
              expect(res.body.data).to.be.an('array');
              done()
          });
      });
    });

})