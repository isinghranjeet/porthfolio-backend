const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const path = require('path'); // ✅ YE ADD KARO
const fs = require('fs'); // ✅ YE ADD KARO
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ YE LINES UNCOMMENT KARO:
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created');
}

// ✅ Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir)); // ✅ '/api/contact/images' ki jagah '/uploads' use karo

// ✅ Routes
app.use('/api/contact', require('./routes/contactRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));