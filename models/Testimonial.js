// const mongoose = require('mongoose');

// const testimonialSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true
//   },
//   position: {
//     type: String,
//     required: [true, 'Position is required'],
//     trim: true
//   },
//   company: {
//     type: String,
//     trim: true
//   },
//   content: {
//     type: String,
//     required: [true, 'Testimonial content is required'],
//     trim: true
//   },
//   avatar: {
//     type: String,
//     trim: true
//   },
//   rating: {
//     type: Number,
//     min: 1,
//     max: 5,
//     default: 5
//   },
//   approved: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Testimonial', testimonialSchema);