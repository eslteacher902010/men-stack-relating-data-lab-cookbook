// controllers/ingredients.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');



//index 
router.get('/', async (req, res) => {
  const ingredients = await Ingredient.find({});
  res.render('ingredients/index.ejs', { ingredients });
});

// Create
router.post('/', async (req, res) => {
  try {
    const newIngredient = new Ingredient(req.body);
    await newIngredient.save();
    res.redirect('/ingredients');
  } catch (error) {
    res.redirect('/ingredients');
  }
});


module.exports = router;
