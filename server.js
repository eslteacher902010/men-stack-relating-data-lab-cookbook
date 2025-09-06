const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');


const passUserToView = require('./middleware/pass-user-to-view.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const authController = require('./controllers/auth.js');
const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');
const foodsController = require('./controllers/foods.js');
const User = require('./models/user.js');


const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});




app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

//pantry
app.get('/users/:userId/foods', async (req, res) => {
     console.log (req.params.userId)
  try {
    const currentUser = await User.findById(req.session.user._id);
    const user = await User.findById(req.params.userId)
    res.render('foods/index.ejs', {
      user,
      currentUser,
      pantry: currentUser.pantry,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

//find all users
app.get('/users', async (req, res) => {
     console.log (req.params.userId)
  try {
    const users = await User.find();
    res.render('users/index.ejs', {
      users
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});




app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);
app.use('/recipes', recipesController);
app.use('/ingredients', ingredientsController);


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
