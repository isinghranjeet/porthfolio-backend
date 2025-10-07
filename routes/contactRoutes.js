const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const crypto = require('crypto');

// Generate Gravatar URL from email
function generateGravatar(email, size = 200, defaultType = 'identicon') {
  if (!email) {
    return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultType}&r=g`;
  }
  
  const normalized = email.trim().toLowerCase();
  const hash = crypto.createHash('md5').update(normalized).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultType}&r=g`;
}

// ✅ SUBMIT FEEDBACK - JSON COMPATIBLE (REMOVE MULTER)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, profileImageBase64 } = req.body;

    console.log('📨 Received data:', {
      name,
      email, 
      hasImage: !!profileImageBase64,
      imageLength: profileImageBase64?.length,
      imageType: profileImageBase64?.substring(0, 20)
    });

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    let profileImageData = null;
    
    // ✅ Agar frontend se base64 image aaya hai
    if (profileImageBase64 && profileImageBase64.startsWith('data:image')) {
      console.log('🖼️ Processing base64 image...');
      
      const mimeType = profileImageBase64.split(';')[0].split(':')[1];
      const fileExtension = mimeType.split('/')[1] || 'jpg';
      const fileName = `profile-${Date.now()}.${fileExtension}`;
      
      profileImageData = {
        filename: fileName,
        originalName: fileName,
        mimetype: mimeType,
        size: Math.floor((profileImageBase64.length * 3) / 4), // Approximate size
        data: profileImageBase64 // Store complete base64 data
      };
      
      console.log('✅ Image data prepared:', {
        filename: fileName,
        mimetype: mimeType
      });
    } else {
      console.log('❌ No valid image data received');
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
    console.log('💾 Contact saved to database with image:', !!profileImageData);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: contact
    });
  } catch (err) {
    console.error('❌ Error submitting feedback:', err);
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
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // ✅ Base64 data ko image mein convert karo
    const base64Data = contact.profileImage.data.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    res.set('Content-Type', contact.profileImage.mimetype);
    res.send(imageBuffer);
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({
      success: false,
      message: 'Error serving image'
    });
  }
});

// ✅ GET ALL FEEDBACK
router.get('/', async (req, res) => {
  try {
    const feedback = await Contact.find().sort({ date: -1 });
    
    const feedbackWithImageUrls = feedback.map(item => {
      const feedbackObj = item.toObject();
      
      // ✅ Agar custom image hai to uska URL
      if (feedbackObj.profileImage && feedbackObj.profileImage.data) {
        feedbackObj.imageUrl = `/api/contact/images/${feedbackObj._id}`;
      } else {
        // Use Gravatar as fallback
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
