const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./userModel');
const sgMail = require('../helpers/sendGridMail')
require('dotenv').config()

const articleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provied article\'s author']
    },
    image: {
        type: String
    },
    title: {
        type: String,
        required: [true, 'Please provied article\'s title']
    },
    content: {
        type: String,
        required: [true, 'Please provied article\'s content']
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes:  [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: Number
}, {
    timestamps: true
});

articleSchema.post('save', function(doc) {
    User.findById(doc.author)
    .populate('followers')
    .then((result) => {
        let followers = result.followers
        console.log('masuk post save article, followers:')
        if(followers.length > 0) {
            followers.forEach(follower => {
                let msg = {
                    to: `${follower.email}`,
                    from: `Go-blog@mail.com`,
                    subject: 'Your subscribed author publish new article',
                    text: `Hello ${follower.username}`,
                    html: `<p>Hello ${follower.username}, you recieve this email because you subscribed to: ${result.username}.
                    the author you subcribe has just publish new aricle, if you want to read the article click:</p>
                    <strong><a href='${process.env.DOMAIN}/home/${doc._id}'>Read Here</a></strong>`,
                  };
                  sgMail.send(msg);
            });
        }
    }).catch((err) => {
        console.log('error getting all followers after save article', err)
    });
})

const Article = mongoose.model('Article', articleSchema);

module.exports = Article
