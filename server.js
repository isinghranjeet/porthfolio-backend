

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
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // ✅ Base64 images ke liye limit badhao
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ❌ YEH LINES COMMENT KARDO YA HATA DO:
// ✅ Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log('Uploads directory created');
// }

// ❌ YEH LINE BHI COMMENT KARDO:
// ✅ Serve static files from uploads directory
// app.use('/api/contact/images', express.static(uploadsDir));

// ✅ Routes
app.use('/api/contact', require('./routes/contactRoutes'));

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
