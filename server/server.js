require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Pose} = require('./models/pose');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/poses', (req, res) => {
  var pose = new Pose({
    englishName: req.body.englishName,
    sanskritName: req.body.sanskritName,
    pronunciation: req.body.pronunciation,
    type: req.body.type,
    level: req.body.level,
    imageUrl: req.body.imageUrl,
    description: req.body.description
  });

  pose.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/poses', (req, res) => {
  Pose.find({}).then((poses) => {
    res.send({poses});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/poses/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Pose.findOne({
    _id: id
  }).then((pose) => {
    if (!pose) {
      return res.status(404).send();
    }

    res.send({pose});

  }, (e) => {
    res.send(400).send();
  });
});

app.delete('/poses/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    };

    const pose = await Pose.findOneAndRemove({
      _id: id
    });
    if (!pose) {
      return res.status(404).send();
    }

    res.send({pose});
  } catch (e) {
    return res.status(400).send();
  }

});

app.patch('/poses/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['englishName', 'sanskritName', 'imageUrl', 'description']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Pose.findOneAndUpdate({
      _id: id
    }, {$set: body}, {new: true}).then((pose) => {
    if (!pose) {
      return res.status(404).send();
    }

    res.send({pose});

  }).catch((e) => {
    res.status(400).send();
  });

});

app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch(e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`)
});

module.exports = {app};
