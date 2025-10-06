

// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./db');

// const app = express();
// connectDB();

// app.use(cors());
// app.use(express.json());

// const contactRoutes = require('./routes/contactRoutes');
// app.use('/api/contact', contactRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));










const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://deep:deep123@cluster0.veuok.mongodb.net/portfolioDB',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Contact Schema
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
  profileImage: {
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

const Contact = mongoose.model('Contact', contactSchema);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'testimonial-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

// Generate Gravatar URL from email
function generateGravatar(email, size = 200, defaultType = 'identicon') {
  if (!email) {
    return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultType}&r=g`;
  }
  
  const normalized = email.trim().toLowerCase();
  const hash = crypto.createHash('md5').update(normalized).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultType}&r=g`;
}

// Routes

// ✅ Submit feedback with file upload
app.post('/api/contact', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    let profileImageData = null;
    
    if (req.file) {
      profileImageData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    const gravatarUrl = generateGravatar(email, 200, 'retro');

    const contact = new Contact({
      name,
      email,
      subject: subject || 'General Feedback',
      message,
      gravatarUrl,
      profileImage: profileImageData
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: contact
    });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error submitting feedback:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      message: err.message 
    });
  }
});

// ✅ Serve uploaded images
app.get('/api/contact/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.sendFile(imagePath);
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({
      success: false,
      message: 'Error serving image'
    });
  }
});

// ✅ Get all feedback
app.get('/api/contact', async (req, res) => {
  try {
    const feedback = await Contact.find().sort({ date: -1 });
    
    const feedbackWithImageUrls = feedback.map(item => {
      const feedbackObj = item.toObject();
      
      if (feedbackObj.profileImage && feedbackObj.profileImage.filename) {
        feedbackObj.imageUrl = `http://localhost:5000/uploads/${feedbackObj.profileImage.filename}`;
      } else {
        feedbackObj.imageUrl = feedbackObj.gravatarUrl;
      }
      
      return feedbackObj;
    });

    res.json(feedbackWithImageUrls);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: err.message 
    });
  }
});

// ✅ Fix existing testimonials with proper Gravatar URLs
app.patch('/api/contact/fix-gravatars', async (req, res) => {
  try {
    const contacts = await Contact.find();
    let updatedCount = 0;

    for (let contact of contacts) {
      const newGravatarUrl = generateGravatar(contact.email, 200, 'retro');
      
      if (contact.gravatarUrl !== newGravatarUrl) {
        contact.gravatarUrl = newGravatarUrl;
        await contact.save();
        updatedCount++;
      }
    }

    res.json({
      success: true,
      message: `Updated ${updatedCount} Gravatar URLs`,
      updated: updatedCount
    });
  } catch (err) {
    console.error('Error fixing Gravatars:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: err.message 
    });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));













// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./db');
// const path = require('path');

// const app = express();

// // Connect MongoDB
// connectDB();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // to serve images

// // Routes
// const contactRoutes = require('./routes/contactRoutes');
// app.use('/api/contact', contactRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
