const express = require('express');
const router = express.Router();

const User = require('../models/user.js');



// add new
router.get('/new', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('foods/new.ejs', { user: currentUser });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

//create
router.post('/', async (req, res) => {
  try {

    const currentUser = await User.findById(req.session.user._id);
    console.log('found user:', currentUser ? currentUser.username : 'none');

    currentUser.pantry.push(req.body);
    await currentUser.save();

    console.log('after save:', currentUser.pantry);

    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    console.log('error saving food:', error);
    res.redirect('/');
  }
});

//delete
router.delete('/:foodId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete
    currentUser.pantry.id(req.params.foodId).deleteOne();
    // Save changes to the user
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});

//edit
router.get('/:foodId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const food = currentUser.pantry.id(req.params.foodId);
    res.render('edit.ejs', {
      food: food,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

//show other pantries

router.get('/:foodId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const food = currentUser.pantry.id(req.params.foodId);

    if (!food) {
      return res.redirect(`/users/${currentUser._id}/foods`);
    }

    res.render('foods/show.ejs', {
      user: currentUser,      
      food: food,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});




module.exports = router;