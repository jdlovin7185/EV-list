const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.get('/documentation.html', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! 😱');
});

app.listen(8080, () => {
  console.log('The app is running on port 8080');
});