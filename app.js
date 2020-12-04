const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const helmet = require('helmet');
const compression = require('compression');

//[Import routes]
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const sAdminRoutes = require('./routes/sAdmin');
const operadorRoutes = require('./routes/operador');

//[Function helpers - hbs]
const helpers = require('./util/helpershbs');

const app = express();

//[Constants]
const PORT = 3000;
const MONGO_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-shard-00-00.2tcmk.mongodb.net:27017,cluster0-shard-00-01.2tcmk.mongodb.net:27017,cluster0-shard-00-02.2tcmk.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=atlas-e4dmvy-shard-0&authSource=admin&retryWrites=true&w=majority`;

//[Set-up] middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine(
  'hbs',
  exphbs({
    extname: '.hbs',
    helpers,
  })
);
app.set('view engine', 'hbs');

const store = new MongoDBStore(
  {
    uri: MONGO_URI,
    collection: 'sessions',
  },
  (err) => {
    if (err) {
      console.log(err);
    }
  }
);

app.use(
  session({
    secret: 'miclave',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrf());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.userRole = req.session.userRole;
  res.locals.isLoggedIn = req.session.isLoggedIn ? req.session.isLoggedIn : false;
  next();
});

//[router] middlewares
app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(sAdminRoutes);
app.use(operadorRoutes);

//[Compression: Compress Assets]
app.use(compression());

//[Helmet:Secure Headers]
app.use(helmet());

//[error] middlewares
app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).render('500');
  }
  res.status(err.statusCode).render('500');
});

//[connecting & listening]
app.listen(process.env.PORT || 3000, () => {
  mongoose
    .connect(MONGO_URI)
    .then((result) => {
      console.log(`Aplicacion iniciada en el servidor: ${PORT}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
