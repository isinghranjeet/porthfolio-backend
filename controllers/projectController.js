// // Handles project-related logic 


// const Project = require('../models/Project');

// exports.getProjects = async (req, res) => {
//   try {
//     const { featured, category } = req.query;
//     let filter = {};

//     if (featured) filter.featured = featured === 'true';
//     if (category) filter.category = category;

//     const projects = await Project.find(filter).sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: projects.length,
//       data: projects
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching projects'
//     });
//   }
// };

// exports.getProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
    
//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: project
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching project'
//     });
//   }
// };

// exports.createProject = async (req, res) => {
//   try {
//     const project = await Project.create(req.body);
//     res.status(201).json({
//       success: true,
//       data: project
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error creating project'
//     });
//   }
// };