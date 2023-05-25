


const mongoose = require('mongoose');
const slugify = require('slugify');
const autopopulate = require('mongoose-autopopulate');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');

const Course = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  videoId: { type: String, required: true },
  level: { type: String },
  slug: { type: String, unique: true },
}, { timestamps: true });

Course.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

Course.plugin(autopopulate);

Course.pre('save', function (next) {
  this.slug = slugify(`${this.name} ${this._id}`, { lower: true });
  next();
});

const Courses = mongoose.model('Course', Course);

module.exports = Courses;

