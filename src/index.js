const path = require('path');
const express = require('express');

const morgan = require('morgan');
const handlebars = require('express-handlebars');
var methodOverride = require('method-override');
const route = require("./routes");

const db = require('./config/db');



//connect to db
db.connect();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//HTTP logger
// app.use(morgan('combined'));
//Template engine
app.use(express.static(path.join(__dirname, 'public')));
console.log("PATH", path.join(__dirname, 'public'));

app.use(methodOverride('_method'));
// app.engine
// app.engine('handlebars', handlebars.engine() );
app.engine('hbs',
  handlebars.engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b
    }
  }));
// app.engine('hbs', handlebars({extname:'.hbs'}));

// app.set
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//app.listen
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})



