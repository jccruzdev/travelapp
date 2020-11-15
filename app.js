const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const helmet = require('helmet');

// const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
// const providerRoutes = require('./routes/provider');
// const saleRoutes = require('./routes/sale');

const app = express();

//[Constants]
const PORT = 3000;
const MONGO_URI = `mongodb://root:root@cluster0-shard-00-00.2tcmk.mongodb.net:27017,cluster0-shard-00-01.2tcmk.mongodb.net:27017,cluster0-shard-00-02.2tcmk.mongodb.net:27017/travelapp?ssl=true&replicaSet=atlas-e4dmvy-shard-0&authSource=admin&retryWrites=true&w=majority`;

//[Set-up] middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine(
  'hbs',
  exphbs({
    extname: '.hbs',
    helpers: {
      comparePath(path, comparator) {
        if (path === comparator) {
          return 'active';
        } else {
          return '';
        }
      },
      formatPrice(num) {
        return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      },

      switch(value, options) {
        this.switch_value = value;
        return options.fn(this);
      },

      case(value, options) {
        if (value == this.switch_value) {
          return options.fn(this);
        }
      },
    },
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
  res.locals.isLoggedIn = req.session.isLoggedIn;
  next();
});

//[router] middlewares
app.use(authRoutes);
app.use(userRoutes);

// app.use(adminRoutes);
// app.use(providerRoutes);
// app.use(saleRoutes);

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
