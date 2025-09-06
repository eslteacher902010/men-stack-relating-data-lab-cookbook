const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// index
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id });
    res.render('recipes/recipeIndex.ejs', {
      recipes,
      user: req.session.user
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// new
router.get('/new', (req, res) => {
  res.render('recipes/new.ejs', { ingredients: [] });
});

// create
router.post('/', async (req, res) => {
  try {
    console.log("Session user:", req.session.user);  //checking error crap
    console.log("Form body:", req.body);
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id;
    await newRecipe.save();
    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/recipes/new');
  }
});

// show
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('ingredients');
    res.render('recipes/show.ejs', { recipe });
  } catch (error) {
    res.redirect('/recipes');
  }
});

// edit
router.get('/:id/edit', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('recipes/edit.ejs', { recipe });
});

// update
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.owner.equals(req.session.user._id)) {
      recipe.name = req.body.name;
      recipe.instructions = req.body.instructions;
      await recipe.save();
      res.redirect(`/recipes/${recipe._id}`);
    } else {
      res.status(403).send("Not authorized to edit this recipe");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.owner.equals(req.session.user._id)) {
      await Recipe.findByIdAndDelete(req.params.id);
      res.redirect('/recipes');
    } else {
      res.status(403).send("Not authorized to delete this recipe");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
