const app = require('../app')
const mocha = require('mocha')
const axios = require('axios')
const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

const Article = require('../models/articleModel')
const User = require('../models/userModel')

const userDataDummy = {
    _id : '',
    username: 'agung',
    email : 'a@mail.com',
    password : '123456',
    token : ''
}

const userDataDummy2 = {}

const resetDocDB = (done) => {
    Article.deleteMany({})
    .then(data => {
        return User.deleteMany({})
    })
    .then(data => {
        done()
    })
    .catch(err => {
        done()
    })

} 
chai.use(chaiHTTP)

describe('Testing connection to server', function () {
    it(' GET on URL : /', function (done) {
        chai.request(app)
        .get('/')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('Server On');
            done()
        });
    });
});

describe('Create User / Register', function () {

    after((done) => {
        User.find({})
        .then(data => {
            userDataDummy._id = data[0]._id
            done()
        })
    })

    it(' POST on URL : /users/register', function (done) {
        chai.request(app)
        .post('/users/register')
        .send({
            username: 'agung',
            email: 'a@mail.com',
            password: '123456'
        })
        .end(function (err, res) {
            expect(res).to.have.status(201);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('creating user success');
            done()
        });
    });
});

describe('Login User', function () {
    it(' POST on URL : /users/login', function (done) {
        chai.request(app)
        .post('/users/login')
        .send({
            email: 'a@mail.com',
            password: '123456'
        })
        .end(function (err, res) {
            userDataDummy.token = res.body.token
            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('login success');
            expect(res.body).to.have.property('token');
            done()
        });
    });
});

// ======================= ARTICLES

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

describe('Create comment', function () {

    before((done) => {
        axios({
            url:'http://localhost:3000/users/register',
            method : 'post',
            data : {
                username : 'john doe',
                email : 'j@mail.com',
                password : '123456'
            }
        })
        .then(data => {
            console.log(data);
            console.log(`succes when creating account dummy 2`);
            done()
        })
        .catch(err => {
            console.log(`error when creating account dummy 2`);
            done()
        })
    })

    it(' POST on URL : /comment', function (done) {
        chai.request(app)
        .post(`/comment/${userDataDummy.ArticleDummyId}`)
        .set("authorization", `Bearer ${userDataDummy.token}`)
        .send({
            message: `Nice info gan...`
        })
        .end(function (err, res) {   
            console.log(userDataDummy ,'//', res.body)                     
            expect(res).to.have.status(201);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal(`success creating comment`);
            done()
        });
    });
});

describe('Delete article by Id', function () {

    after((done) => {
        resetDocDB(done)
    })

    it(' DELETE on URL : /articles', function (done) {
        chai.request(app)
        .delete(`/articles/${userDataDummy.ArticleDummyId}`)
        .set("authorization", `Bearer ${userDataDummy.token}`)
        .end(function (err, res) {                        
            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal(`success delete article with Id ${userDataDummy.ArticleDummyId}`);
            done()
        });
    });
});