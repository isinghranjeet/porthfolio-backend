// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       'mongodb+srv://deep:deep123@cluster0.veuok.mongodb.net/portfolioDB',
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;







// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       maxPoolSize: 10,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
    
//     mongoose.connection.on('error', err => {
//       console.log('MongoDB connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
//       console.log('MongoDB disconnected');
//     });

//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;