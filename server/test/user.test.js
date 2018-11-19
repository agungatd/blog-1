const app = require("../app.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
const jwt = require('jsonwebtoken')
const User = require("../models/userModel");

chai.use(chaiHttp);

describe("Register Validation User", () => {
  describe("POST => /users/register", () => {
    let dataNewUser = {
      username: "Agung",
      email: "agung@mail.com",
      password: "asdasd123"
    };

    afterEach(() => {
      User.deleteOne({email:'agung@mail.com'}).then(data => {});

      dataNewUser = {
        username: "Agung",
        email: "agung@mail.com",
        password: "asdasd123"
      };
    });

    it("should return msg 'Username required' response error if username is empty", done => {
      dataNewUser.username = "";
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Username required");
          expect(res.body.status).to.equal("failed");
          done();
        });
    });

    it("should return msg 'Email required' response error if email is empty", done => {
      dataNewUser.email = "";
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Email required");
          expect(res.body.status).to.equal("failed");
          done();
        });
    });

    it("should return msg 'Password required' response error if password is empty", done => {
      dataNewUser.email = "agung@mail.com";
      dataNewUser.password = "";
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Password required");
          expect(res.body.status).to.equal("failed");
          done();
        });
    });


    it("should return msg 'Password length must be greater than 6' response error if password length must be less than 6", done => {
      dataNewUser.password = "123as";
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal(
            "Password length must be greater than 6"
          );
          expect(res.body.status).to.equal("failed");
          done();
        });
    });

    it("should return msg 'Email is invalid' if input 'agungmail.com' ", done => {
      dataNewUser.password = "asdasd123";
      dataNewUser.email = "agungmail.com";
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Email is invalid");
          expect(res.body.status).to.equal("failed");
          done();
        });
    });

    it("should return msg 'Email is invalid' response error if input 'agung.comnmail@ean' ", done => {
      dataNewUser.email = "agung.comnmail@ean";
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Email is invalid");
          expect(res.body.status).to.equal("failed");
          done();
        });
    });

    it("should return msg 'Username length must be greater than 2' if username length must greater than 2 ", done => {
      dataNewUser.username = "a";
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal(
            "Username length must be greater than 2"
          );
          expect(res.body.status).to.equal("failed");
          done();
        });
    });

  });
});


describe("Register create data", () => {
  describe("POST => /users/register", () => {
    let dataNewUser = {
      username: "Agung",
      email: "agung@mail.com",
      password: "asdasd123"
    };

    afterEach(() => {
      User.deleteOne({email: 'agung@mail.com'}).then(data => {});

      dataNewUser = {
        username: "Agung",
        email: "agung@mail.com",
        password: "asdasd123"
      };
    });

    it("should return response with properties status, message, and data new user if data complete", done => {
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("username");
          expect(res.body.data).to.have.property("email");
          expect(res.body.data).to.have.property("password");
          expect(res.body.data.username).to.equal(dataNewUser.username);
          expect(res.body.data.email).to.equal(dataNewUser.email);
          expect(res.body.status).to.equal("success");
          expect(res.body.message).to.equal(
            `success creating new account with email ${dataNewUser.email}`
          );
          done();
        }).timeout(5000)
    })
  })
})

describe('Registration with same email', () => {
  describe('POST => /users/register', () => {
    let dataNewUser = {
      username: "Agung",
      email: "agung@mail.com",
      password: "asdasd123"
    }

    before(() => {
      let user = new User(dataNewUser)

      user.save().then(data => {})
    })

    after(() => {
      User.deleteOne({email: 'agung@mail.com'}).then(data => {})
    })

    it("should return msg 'Email already taken' response error if input with same email with another user ", done => {
      chai
        .request(app)
        .post("/users/register")
        .send(dataNewUser)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("message");
          expect(res.body.status).to.equal("failed");
          expect(res.body.message).to.equal("Email is already taken");
          done()
        })
    }).timeout(500)
  })
})

describe("Login Verification", () => {
  describe("POST => /users/login", () => {
    let dataLogin = {
      email: "agung@mail.com",
      password: "asdasd123"
    }

    after(function () {
      User.deleteOne({email:'agung@mail.com'}).then(data => {})
    })

    before(function () {
      let dataNewUser = {
        username: "Agung",
        email: "agung@mail.com",
        password: "asdasd123"
      }

      let user = new User(dataNewUser)

      user.save().then(data => {})
    });

    it("should return msg 'wrong password or email' if password input wrong", (done) => {
      dataLogin.password = 'asdasd12'
      chai
        .request(app)
        .post("/users/login")
        .send(dataLogin)
        .end((err, res) => {
          expect(res).to.have.status(406);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('message');
          expect(res.body.status).to.equal('failed');
          expect(res.body.message).to.equal('login failed, wrong password or email');
          done();
        });
    })

    it("should return msg 'user not found' if user not registered", done => {
      chai
        .request(app)
        .post("/users/login")
        .send({
          email: 'xxx@mail.com',
          password: 'asdasd123'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('message');
          expect(res.body.status).to.equal('failed');
          expect(res.body.message).to.equal('login failed, user not found');
          done();
        });
    });
  });
});

describe('Login Success', () => {
  describe('POST =>  /users/login', () => {

    before(() => {
      let dataNewUser = {
        username: "Agung",
        email: "agung@mail.com",
        password: "asdasd123"
      }

      let user = new User(dataNewUser)

      user.save().then(data => {})
    });

    after(() => {
      User.deleteOne({email:'agung@mail.com'}).then(data => {})
    })

    it("should return token if user login succesfully", done => {

      let dataLogin = {
        email: "agung@mail.com",
        password: "asdasd123"
      }

      chai
        .request(app)
        .post("/users/login")
        .send(dataLogin)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('token');
          expect(res.body.status).to.equal('success');
          done();
        });
    });
  })
})

describe('Get current online user data', () => {
  describe('GET => /users', () => {

    let token = ''

    before(function () {
      let dataNewUser = {
        username: "Agung",
        email: "agung@mail.com",
        password: "asdasd123"
      }

      let user = new User(dataNewUser)

        user.save().then(data => {
          token = jwt.sign({
            id: data._id,
            username: data.username
          }, process.env.JWT_SECRET)
        
      })

    });

    after(function () {
      User.deleteOne({email:'agung@mail.com'}).then(data => {})
    })

    it('should return current user data with properties id and username', done => {
      chai
        .request(app)
        .get('/users')
        .set({
          token
        })
        .end((err, res) => {
          console.log('res.body', res.body)
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          expect(res.body.data[0]).to.have.property('_id')
          expect(res.body.data[0]).to.have.property('username')
          expect(res.body.data[0]).to.have.property('email')
          done()
        })
    })
  })
})
