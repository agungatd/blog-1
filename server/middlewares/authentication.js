
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authenticate = (req, res, next) => {    
    // console.log('masuk auth==>', req.headers)
    if (req.headers['authorization']) {
      let tokens = req.headers['authorization'].split(' ')      
      if (tokens[0] == 'Bearer') {          
        jwt.verify(tokens[1], process.env.JWT_SECRET, (err, decoded) => {
          // console.log('decoded===>', decoded, err)
          if (!err && decoded) {
            User.findById(decoded.id)
            .then(user=>{
              if(user == null){
                res.status(400).json({ "error": "You have no authorization due to unregistered account code.a: user null" })  
              }
              else{
                req.user = decoded                                                   
                next()
              }              
            })
            .catch(err =>{
              res.status(400).json({ "error": "You have no authorization due to unregistered account code.b: server error when findById" })  
            })                        
          } else {            
            res.status(400).json({ "error": "You have no authorization due to unregistered account code.c: error when decoding token" })
          }
        })
      }
    } else {
      res.status(400).json({ "error": "You have no authorization due to unregistered account code.d: wrong authorization headers" })
    }
  }

  module.exports = authenticate