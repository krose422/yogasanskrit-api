var mongoose = require('mongoose');

var Pose = mongoose.model('Pose', {
  englishName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  sanskritName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  pronunciation: {
    type: String,
    required: false,
    minLength: 1,
    trim: true
  },
  type: {
    type: String,
    required: false,
    minLength: 1,
    trim: true
  },
  level: {
    type: String,
    required: false,
    minLength: 1,
    trim: true
  },
  imageUrl: {
    type: String,
    required: false,
    minLength: 1,
    trim: true
  },
  description: {
    type: String,
    required: false,
    minLength: 1,
    trim: false
  }
});

module.exports = {Pose};
