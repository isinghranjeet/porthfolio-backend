// // Handles testimonials logic 


// const Testimonial = require('../models/Testimonial');

// exports.getTestimonials = async (req, res) => {
//   try {
//     const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: testimonials.length,
//       data: testimonials
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching testimonials'
//     });
//   }
// };

// exports.createTestimonial = async (req, res) => {
//   try {
//     const testimonial = await Testimonial.create(req.body);
//     res.status(201).json({
//       success: true,
//       data: testimonial,
//       message: 'Testimonial submitted for approval'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error creating testimonial'
//     });
//   }
// };