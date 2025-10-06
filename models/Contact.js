
// // backend/models/Contact.js
// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   message: { type: String, required: true },
//   date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Contact', contactSchema);





const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'] 
  },
  subject: { 
    type: String, 
    default: 'General Inquiry' 
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'] 
  },
  gravatarUrl: { 
    type: String 
  },
  profileImage: { // New field for uploaded image
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Contact', contactSchema);













// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   subject: { type: String },
//   message: { type: String, required: true },
//   image: { type: String }, // store filename or URL
//   date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Contact', contactSchema);
