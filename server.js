// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/recipebook', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Recipe model
const Recipe = mongoose.model('Recipe', {
  title: String,
  image: String,
  ingredients: String,
  instructions: String,
});

// Routes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    const { title, image, ingredients, instructions } = req.body;
    const newRecipe = new Recipe({ title, image, ingredients, instructions });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error('Error adding recipe:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
