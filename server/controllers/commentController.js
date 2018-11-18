const Comment = require('../models/commentModel')

class CommentController {

    static createComment(req, res) {
        let newComment = {
            message: req.body.message,
            commentator: req.user.id,
            article: req.params.id
        }
        let comment = new Comment(newComment)
        comment.save()
            .then(data => {
                res.status(201).json({
                    status: `success`,
                    message: `success creating comment`
                })
            })
            .catch(err => {
                res.status(500).json({
                    status: `failed`,
                    message: `failed creating comment`,
                    err: err
                })
            })
    }

    static deleteComment(req, res) {
        Comment.remove({
            _id: req.params.id,
            commentator: req.user.id
        }, function (err, result) {
            if (!err) {
                res.status(200).json({
                    status: `success`,
                    message: `deleteing comment success`
                })
            } else {
                res.status(500).json({
                    status: `failed`,
                    message: `deleteing comment failed`,
                    err: err
                })
            }
        })
    }

    static findComment(req, res) {
        Comment.find({
                article: req.params.id
            })
            .populate('commentator')
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    data: data
                })
            })
            .catch(err => {
                res.status(500).json({
                    status: 'failed',
                    message: 'failed when find all comment'
                })
            })
    }
}

module.exports = CommentController