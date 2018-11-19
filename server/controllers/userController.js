const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserController {

  static register(req, res) {
    let data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }
    User.create(data)
      .then(data => {
        res.status(201).json({
          status: `success`,
          message: `success creating new account with email ${data.email}`,
          data
        })
      })
      .catch(err => {
        if(err.message == 'User validation failed: username: Username required') {
          res.status(500).json({
            status: `failed`,
            message: 'Username required'
          })
        } else if(err.message == 'User validation failed: email: Email required') {
          res.status(500).json({
            status: `failed`,
            message: 'Email required'
          })
        } else if(err.message == 'User validation failed: password: Password required') {
          res.status(500).json({
            status: `failed`,
            message: 'Password required'
          })
        } else if(err.message == 'User validation failed: password: Password length must be greater than 6') {
          res.status(500).json({
            status: `failed`,
            message: 'Password length must be greater than 6'
          })
        } else if(err.message == 'User validation failed: email: Email is invalid') {
          res.status(500).json({
            status: `failed`,
            message: 'Email is invalid'
          })
        } else if(err.message== 'User validation failed: username: Username length must be greater than 2') {
          res.status(500).json({
            status: `failed`,
            message: 'Username length must be greater than 2'
          })
        } else if(err.errmsg.indexOf('email_1 dup key') != -1) {
          res.status(500).json({
            status: `failed`,
            message: 'Email is already taken'
          })
        }
      })
  }

  static login(req, res) {

    User.find({
        email: req.body.email
      })
      .then(data => {
        console.log('masuk login server')
        if (data.length === 1) {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            const token = jwt.sign({
              id: data[0]._id,
              username: data[0].username,
              email: data[0].email
            }, process.env.JWT_SECRET);

            res.status(200).json({
              status: `success`,
              message: `login success`,
              token: token,
              userId: data[0]._id
              ,username: data[0].username
            })
          } else {
            res.status(406).json({
              status: `failed`,
              message: `login failed, wrong password or email`
            })
          }
        } else {
          res.status(404).json({
            status: `failed`,
            message: `login failed, user not found`
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: `failed`,
          message: `error when log-in user`
        })
      })
  }

  static getAllUsers(req, res) {
    User.find({})
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data
      })
    }).catch((err) => {
      
    });
  }

  static getAllFollowers(req, res) {
    User.findById(req.params.id)
    .populate('followers')
    .then((result) => {
      res.status(200).json({
        message: 'success in getting all followers',
        data: result.followers
      })
    }).catch((err) => {
      res.status(500).json({
        message:'Error when getting all followers',
        err})
    });
  }

  static updateFollower(req, res) {
    User.findOne({followers: req.body.follower})
    .then((result) => {
      if(!result) {
        User.findByIdAndUpdate(req.params.id, {
          $push: {
            followers: req.body.follower
          }
        }).then((result) => {
          res.status(201).json(result)
        }).catch((err) => {
          res.status(500).json({
            message:'Error when adding new followers',
            err})
        });
      } else {
        res.status(200).json({message:'You\'ve already follow this author'})
      }
    }).catch((err) => {
      res.status(500).json({
        message:'Error when find user in the server',
        err})
    });
  }
}
// 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
module.exports = UserController