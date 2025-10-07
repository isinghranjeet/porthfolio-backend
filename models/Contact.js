

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



