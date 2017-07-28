const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes')

const PORT = 4000;    

mongoose.Promise = global.Promise

let db = mongoose.connect('mongodb://kodedland:kodedland@ds125113.mlab.com:25113/kodedland')
.then(() => {
  console.log('Database successfully connected');
}).catch((err) => {
  console.log(err);
})

const app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//Express Middleware
app.use(express.static(path.join(__dirname, 'assets')))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json());

app.use('/', routes);


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})