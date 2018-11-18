const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
  username:  {
      type :String,
      required : true
  },
  email: {
      type : String,
      unique : true,
      required : true
  },
  password: {
    type : String,
    required : true,
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