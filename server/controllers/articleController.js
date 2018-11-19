const Article = require('../models/articleModel')
const dateHelper = require('../helpers/dateHelper')
const textToSpeech = require('@google-cloud/text-to-speech')

class ArticleController {

  static findOne(req, res) {
    Article.find({
        _id: req.params.id
      })
      .populate('author')
      .populate({
        path: 'comments',
        populate: {
          path: 'commentator '
        }
      })
      .then(data => {
        data = dateHelper(data)
        res.status(200).json({
          status: `success`,
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: `failed`,
          message: `error when find article`
        })
      })
  }

  static findOneRandom(req, res) {
    Article.find({})
    .populate('author')
    .populate({
      path: 'comments',
      populate: {
        path: 'commentator '
      }
    })
    .then((result) => {
      let random = Math.floor(Math.random() * result.length)
      res.status(200).json({
        status: 'success',
        message: 'successfully get random article.'
        ,data:result[random]
      })
    }).catch((err) => {
      res.status(500).json(err)
    });
  }

  static createArticle(req, res) {

    let newArticle = {
      title: req.body.title,
      author: req.user.id,
      content: req.body.content,
      image: req.body.image,
      comment: []
    }

    let article = new Article(newArticle)

    article.save()
      .then(data => {
        res.status(201).json({
          status: `success`,
          message: `success when creating article`
        })
      })
      .catch(err => {
        res.status(500).json({
          status: `failed`,
          message: `failed when creating article`,
          body: req.body,
          user: req.user
        })
      })
  }

  static deleteArticle(req, res) {

    Article.deleteOne({
      _id: req.params.id,
      author: req.user.id
    }, function (err) {
      if (err) {
        res.status(500).json({
          status: `failed`,
          message: `failed when delete article with Id ${req.params.id}`
        })
      } else {
        res.status(200).json({
          status: `success`,
          message: `success delete article with Id ${req.params.id}`
        })
      }
    });

  }

  static updateArticle(req, res) {

    let updates = {
      title: req.body.title,
      author: req.user.id,
      content: req.body.content,
      image: req.body.image
    }
    Article.updateOne({
      _id: req.params.id,
      author: req.user.id
    }, {
      $set: updates
    }, (err, result) => {
      if (err) {
        res.status(500).json({
          status: `failed`,
          message: `failed when update article`
        })
      } else {
        res.status(200).json({
          status: `success`,
          message: `sucess when update article`
        })
      }
    });

  }

  static updateViews(req, res) {
    console.log(req.body)
    let updates = {
      views: req.body.views
    }
    Article.updateOne({
      _id: req.params.id
    }, {
      $set: updates
    }, (err, result) => {
      if (err) {
        res.status(500).json({
          status: `failed`,
          message: `failed when update article`
        })
      } else {
        res.status(200).json({
          status: `success`,
          message: `sucess when update article`
        })
      }
    });
  }

  static findAllArticle(req, res) {

    Article.find()
      .populate('comments')
      .populate('author')
      .then(data => {
        data = dateHelper(data)
        res.status(200).json({
          status: `success`,
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: `failed`,
          message: `failed when find all articles`
        })
      })

  }

  static getSpeech(req, res) {
    const fs = require('fs');
    const client = new textToSpeech.TextToSpeechClient();
    const request = {
      input: {text: req.body.text},
      // Select the language and SSML Voice Gender (optional)
      voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
      // Select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };
    let outputFile = 'output.mp3'

    client.synthesizeSpeech(request, (err, response) => {
      if (err) {
        console.error('ERROR:', err);
        return;
      }
      res.status(201).json({data: response.audioContent})

      fs.writeFile(outputFile, response.audioContent, 'binary', err => {
          if (err) {
            console.error('ERROR:', err);
            return;
          }
          console.log(`Audio content written to file: ${outputFile}`);
          fs.readFile(outputFile, 'binary', function(err, buf) {
            console.log(buf.toString());
          });
        });
    });
  }

  static getPopular(req, res) {
    Article.find({})
    .populate('author')
    .limit(5)
    .sort({views:-1})
    .then((result) => {
      console.log( 'get populars:', result)
      res.status(200).json(result)
    }).catch((err) => {
      res.status(500).json(err)
    });
  }

}

module.exports = ArticleController
