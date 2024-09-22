const express = require("express");

const sequelize = require('./config/database');
const Project = require('./models/project');

const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Sync the database
sequelize.sync()
  .then(() => console.log('Database synced with model.'))
  .catch(err => console.log('Error: ' + err));


// Configure multer for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify the destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique file name
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },  // Limit the file size to 25MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;  // Only accept image files
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only images are allowed!');
    }
  }
});


// Route to add a new project
app.post('/add-project', upload.single('image'), async (req, res) => {
  try {
    // alert(req.body);
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ status: 'error', message: 'Title and description are required' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Image is required' });
    }
    const imagePath = `uploads/${req.file.filename}`;
// console.log("image path::"+imagePath);
    // Create a new project
    const project = await Project.create({
      title: title,
      description: description,
      image: imagePath,
    });

    console.log('Project created:', project.toJSON());

    // Send success response after project creation
    res.status(200).json({ status: 'success', message: 'Data stored successfully', project });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to store data' });
  }
});


app.get('/projects', async (req, res) => {
  try {

    const baseUrl = `http://localhost:3001`;  // Replace with your domain in production

    // Create a new project
    const projects = await Project.findAll();


    const projectsWithFullPath = projects.map(project => {
      const projectObj = project.toJSON(); // Convert to plain object
      if (projectObj.image) {
        projectObj.image = `${baseUrl}/${projectObj.image}`;  // Correct concatenation
      }
      return projectObj;  // Return the modified object
    });
    // Send success response after project creation
    res.status(200).json({ status: 'success', message: 'Data get successfully', projects: projectsWithFullPath });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to get data' });
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server connected on port 3001");
});
