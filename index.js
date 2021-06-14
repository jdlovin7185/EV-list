const express = require('express'),
  morgan = require('morgan');

const app = express();
const mongoose = require('mongoose');
const Models = require('./model.js');

const Cars = Models.Car;
const Users = Models.User;

app.use(morgan('common'));

mongoose.connect('mongodb://localhost:27017/eletrics', {useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.get('/documentation.html', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

// Returns a make of a car
app.get('/make', (req, res) => {
  res.json('BMW');
});

// Returns the model of the car
app.get('/make:model', (req, res) => {
  res.json('RTJ');
});

// Returns the style of the car
app.get('/style', (req, res) => {
  res.json('SUV');
});

// Returns the connector type of the car
app.get('/connector', (req, res) => {
  res.json('Type 2');
});

// Returns if the car is offroad or not
app.get('/offroad', (req, res) => {
  res.json('Nope');
});

// Creates a new user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email
      })
      .then((user) => {res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// Gets a list of users
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Updates user info
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, 
    { $set:
      {
        Username: req.params.Username,
        Password: req.params.Password,
        Email: req.body.Email,
      }
  },
  { new: true }, 
  // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Adds a car to the users favorite
app.post('/users/:Username/inventory/:Make', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $push: { CarOwned: req.params.CarID }},
    { new: true },
    // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(200).json(updatedUser);
      }
    });
});

// Deletes a player from user list
app.delete('users/:Username/inventory/:Make', (req, res) => {
Users.findOneAndUpdate({ Username: req.params.Username}),
{ $pull:
{
  OwnedCar: req.params.CarID
}},
{new: true},
(err, updatedUser) => {
  if(err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
  };
});

// Deletes the user
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Something broke! 😱 ${err.message}`);
});

app.listen(8080, () => {
  console.log('The app is running on port 8080');
});