const express = require("express");

const sequelize = require('./config/database');
const Project = require('./models/project');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Sync the database
sequelize.sync()
  .then(() => console.log('Database synced with model.'))
  .catch(err => console.log('Error: ' + err));

// Route to add a new project
app.post('/add-project', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ status: 'error', message: 'Title and description are required' });
      }
    // Create a new project
    const project = await Project.create({
      title: title,
      description: description,
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

      // Create a new project
      const projects = await Project.findAll();
  
  
      // Send success response after project creation
      res.status(200).json({ status: 'success', message: 'Data stored successfully', projects });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ status: 'error', message: 'Failed to store data' });
    }
  });

// Start the server
app.listen(3001, () => {
  console.log("Server connected on port 3001");
});
