// const Contact = require('../models/Contact');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto'); // 👈 for gravatar hash generation

// // Function to generate gravatar URL
// function generateGravatar(email, size = 200, defaultType = 'identicon') {
//   if (!email) return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultType}`;
//   const normalized = email.trim().toLowerCase();
//   const hash = crypto.createHash('md5').update(normalized).digest('hex');
//   return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultType}`;
// }

// // Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// exports.submitContact = async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;

//     // ✅ Generate gravatar image URL
//     const gravatarUrl = generateGravatar(email, 200, 'mp');

//     // ✅ Save to database with gravatarUrl
//     const contact = new Contact({
//       name,
//       email,
//       message,
//       gravatarUrl,
//       date: new Date(),
//     });

//     await contact.save();

//     // Send email notification (optional)
//     try {
//       const mailOptions = {
//         from: email,
//         to: process.env.EMAIL_USER,
//         subject: `Portfolio Contact: ${subject}`,
//         html: `
//           <h3>New Contact Form Submission</h3>
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Subject:</strong> ${subject}</p>
//           <p><strong>Message:</strong></p>
//           <p>${message}</p>
//           <hr/>
//           <img src="${gravatarUrl}" alt="User Avatar" width="80" height="80" style="border-radius:50%;"/>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//     } catch (emailError) {
//       console.log('Email sending failed, but contact was saved to database');
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Message sent successfully!',
//     });
//   } catch (error) {
//     console.error('Contact form error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error sending message. Please try again.',
//     });
//   }
// };

// exports.getContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find().sort({ date: -1 }); // fixed field
//     res.status(200).json({
//       success: true,
//       data: contacts,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching contacts',
//     });
//   }
// };










const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Function to generate gravatar URL
function generateGravatar(email, size = 200, defaultType = 'identicon') {
  if (!email) return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultType}`;
  const normalized = email.trim().toLowerCase();
  const hash = crypto.createHash('md5').update(normalized).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultType}`;
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // ✅ DEBUG: Check if file is received
    console.log('📁 Request File:', req.file);
    console.log('📝 Request Body:', req.body);

    // ✅ Generate gravatar image URL
    const gravatarUrl = generateGravatar(email, 200, 'mp');

    // ✅ Handle file upload data - YEH IMPORTANT HAI
    const profileImage = req.file ? {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    } : null;

    console.log('💾 Profile Image Data:', profileImage);

    // ✅ Save to database with BOTH gravatarUrl AND profileImage
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      gravatarUrl,
      profileImage, // ✅ YEH LINE ADD KARNA THA
      date: new Date(),
    });

    await contact.save();
    console.log('✅ Contact saved to database with profile image');

    // Send email notification (optional)
    try {
      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr/>
          <img src="${gravatarUrl}" alt="User Avatar" width="80" height="80" style="border-radius:50%;"/>
          ${profileImage ? `<p><strong>Profile Image:</strong> ${profileImage.filename}</p>` : ''}
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.log('Email sending failed, but contact was saved to database');
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      profileImage: profileImage
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again.',
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
    });
  }
};