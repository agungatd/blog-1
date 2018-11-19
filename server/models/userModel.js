const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
  username:  {
    type :String,
    required: [true, 'First name required'],
    validate: {
        validator() {
            if (this.username.length < 3) {
                throw new Error('First name length must be greater than 2')
            }
        }
    }
  },
  email: {
      type : String,
      required: [true, 'Email required'],
      unique: true,
      validate: {
        validator() {
          let patt = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)
          if (!patt.test(this.email)) {
            throw new Error('Email is invalid')
          }
        }
      }
  },
  password: {
    type : String,
    required : [true, 'Password required'],
    validate : {
        validator (val) {
            if (val.length >= 6) {
                return true
            } else {
                return false
            }
        }
    }
  },
  followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
  }]
},{
    timestamps : true
});

userSchema.post('validate', (doc) => {
    var salt = bcrypt.genSaltSync(10);
    doc.password = bcrypt.hashSync(doc.password, salt);
})

const User = mongoose.model('User', userSchema);

module.exports = User