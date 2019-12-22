const {Schema, model} = require('mongoose');

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  }
});

module.exports = model('Nav', schema);
