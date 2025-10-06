// const mongoose = require('mongoose');

// const projectSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Project title is required'],
//     trim: true
//   },
//   description: {
//     type: String,
//     required: [true, 'Project description is required'],
//     trim: true
//   },
//   technologies: [{
//     type: String,
//     trim: true
//   }],
//   imageUrl: {
//     type: String,
//     trim: true
//   },
//   liveUrl: {
//     type: String,
//     trim: true
//   },
//   githubUrl: {
//     type: String,
//     trim: true
//   },
//   category: {
//     type: String,
//     default: 'web'
//   },
//   featured: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Project', projectSchema);