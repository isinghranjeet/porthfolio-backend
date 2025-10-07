
// // routes/contact.js
// const express = require('express');
// const router = express.Router();
// const Contact = require('../models/Contact');

// // Submit feedback
// router.post('/', async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;

//     const contact = new Contact({
//       name,
//       email,
//       subject,
//       message,
//       image: 'https://via.placeholder.com/100' // default image if none provided
//     });

//     await contact.save();
//     res.status(201).json({ success: true, message: 'Feedback submitted successfully!' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// });

// // Get all feedback
// router.get('/', async (req, res) => {
//   try {
//     const feedback = await Contact.find();
//     res.json(feedback);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;



















// const express = require('express');
// const router = express.Router();
// const Contact = require('../models/Contact');
// const crypto = require('crypto');
// const upload = require('../middleware/upload');
// const path = require('path');
// const fs = require('fs');

// // Generate Gravatar URL from email
// function generateGravatar(email, size = 200, defaultType = 'identicon') {
//   if (!email) {
//     return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultType}&r=g`;
//   }
  
//   const normalized = email.trim().toLowerCase();
//   const hash = crypto.createHash('md5').update(normalized).digest('hex');
//   return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultType}&r=g`;
// }

// // ✅ Submit feedback with file upload
// router.post('/', upload.single('profileImage'), async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;

//     if (!name || !email || !message) {
//       // If there's an uploaded file but validation fails, delete it
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(400).json({
//         success: false,
//         message: 'Name, email, and message are required'
//       });
//     }

//     let profileImageData = null;
    
//     // If file was uploaded
//     if (req.file) {
//       profileImageData = {
//         filename: req.file.filename,
//         originalName: req.file.originalname,
//         path: req.file.path,
//         mimetype: req.file.mimetype,
//         size: req.file.size
//       };
//     }

//     // Generate Gravatar as fallback
//     const gravatarUrl = generateGravatar(email, 200, 'retro');

//     const contact = new Contact({
//       name,
//       email,
//       subject: subject || 'General Feedback',
//       message,
//       gravatarUrl,
//       profileImage: profileImageData
//     });

//     await contact.save();

//     res.status(201).json({
//       success: true,
//       message: 'Feedback submitted successfully!',
//       data: contact
//     });
//   } catch (err) {
//     // Clean up uploaded file if error occurs
//     if (req.file) {
//       fs.unlinkSync(req.file.path);
//     }
//     console.error('Error submitting feedback:', err);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Server error',
//       message: err.message 
//     });
//   }
// });

// // ✅ Serve uploaded images
// router.get('/images/:filename', (req, res) => {
//   try {
//     const filename = req.params.filename;
//     const imagePath = path.join(__dirname, '../uploads', filename);
    
//     // Check if file exists
//     if (!fs.existsSync(imagePath)) {
//       return res.status(404).json({
//         success: false,
//         message: 'Image not found'
//       });
//     }

//     // Send the image file
//     res.sendFile(imagePath);
//   } catch (err) {
//     console.error('Error serving image:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Error serving image'
//     });
//   }
// });

// // ✅ Get all feedback
// router.get('/', async (req, res) => {
//   try {
//     const feedback = await Contact.find().sort({ date: -1 });
    
//     // Transform data to include image URLs
//     const feedbackWithImageUrls = feedback.map(item => {
//       const feedbackObj = item.toObject();
      
//       // If user uploaded an image, create URL for it
//       if (feedbackObj.profileImage && feedbackObj.profileImage.filename) {
//         feedbackObj.imageUrl = `/api/contact/images/${feedbackObj.profileImage.filename}`;
//       } else {
//         // Use Gravatar as fallback
//         feedbackObj.imageUrl = feedbackObj.gravatarUrl;
//       }
      
//       return feedbackObj;
//     });

//     res.json(feedbackWithImageUrls);
//   } catch (err) {
//     console.error('Error fetching contacts:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error',
//       message: err.message 
//     });
//   }
// });

// module.exports = router;









// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const Contact = require('../models/Contact');

// const router = express.Router();

// // ⚙️ Setup image upload directory
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // 📩 POST contact message
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;
//     const image = req.file ? req.file.filename : null;

//     const newContact = new Contact({ name, email, subject, message, image });
//     await newContact.save();

//     res.status(201).json({ success: true, message: 'Message saved successfully' });
//   } catch (error) {
//     console.error('Error saving contact:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // 📤 GET all contacts (with images)
// router.get('/', async (req, res) => {
//   try {
//     const contacts = await Contact.find();
//     res.json(contacts);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch contacts' });
//   }
// });

// module.exports = router;


































// routes/contactRoutes.js - YE PURA CODE REPLACE KARDO

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const crypto = require('crypto');

// Generate Gravatar URL
function generateGravatar(email, size = 200, defaultType = 'identicon') {
  if (!email) return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultType}&r=g`;
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultType}&r=g`;
}

// ✅ SUBMIT FEEDBACK - BASE64 IMAGE ACCEPT KARO
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, profileImageBase64 } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    let profileImageData = null;
    
    // ✅ Agar frontend se base64 image aaya hai
    if (profileImageBase64 && profileImageBase64.startsWith('data:image')) {
      const mimeType = profileImageBase64.split(';')[0].split(':')[1];
      const fileName = `profile-${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`;
      
      profileImageData = {
        filename: fileName,
        mimetype: mimeType,
        size: Math.floor((profileImageBase64.length * 3) / 4), // Approximate size
        data: profileImageBase64 // ✅ Pure base64 data store karo
      };
    }

    const gravatarUrl = generateGravatar(email);

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
    console.error('Error submitting feedback:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      message: err.message 
    });
  }
});

// ✅ SERVE IMAGES FROM BASE64 DATA
router.get('/images/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact || !contact.profileImage || !contact.profileImage.data) {
      // Agar image nahi hai to Gravatar return karo
      const gravatarUrl = generateGravatar(contact?.email);
      return res.redirect(gravatarUrl);
    }

    // ✅ Base64 data ko image response mein convert karo
    const base64Data = contact.profileImage.data.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    res.set('Content-Type', contact.profileImage.mimetype);
    res.send(imageBuffer);
  } catch (err) {
    console.error('Error serving image:', err);
    // Error case mein Gravatar redirect karo
    res.redirect('https://www.gravatar.com/avatar/?s=200&d=identicon&r=g');
  }
});

// ✅ GET ALL FEEDBACK
router.get('/', async (req, res) => {
  try {
    const feedback = await Contact.find().sort({ date: -1 });
    
    const feedbackWithImageUrls = feedback.map(item => {
      const feedbackObj = item.toObject();
      
      // ✅ Agar custom image hai to uska URL, nahi to gravatar
      if (feedbackObj.profileImage && feedbackObj.profileImage.data) {
        feedbackObj.imageUrl = `/api/contact/images/${feedbackObj._id}`;
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

module.exports = router;
