//require("newrelic");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
//const bodyParser = require("body-parser");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");

const errorHandler = require("./middlewares/errorHandler");
const keys = require("./config/keys");

require("./models/Sequence"); // Used in id generation
require("./models/Country"); // Used in various lookup routes
require("./models/State"); // Used in various lookup routes
require("./models/User"); // Load before passport, etc.,
require("./models/Match"); // Used in match routes, etc.
require("./models/Token"); // Used in user routes
require("./models/Payment"); // Used in payment route
require("./models/Ping"); // Used in match routes (for stats)
require("./models/Stripe"); // Used to log Stripe webhook data
require("./services/passport"); // Since nothing is being exported

const memcache = require("./services/memcache")(keys);

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        baseUri: ["'self'"],
        blockAllMixedContent: [],
        defaultSrc: ["'self'", "'sha256-kwpt3lQZ21rs4cld7/uEm9qI5yAbjYzx+9FGm/XmwNU='"],
        fontSrc: ["'self'", "https:", "data:"],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'", "*.stripe.com"],
        imgSrc: ["'self'", "data:", "*.googleusercontent.com"],
        objectSrc: ["'none'"],
        scriptSrc: [
          "'self'",
          "https",
          "*.stripe.com",
          "'sha256-4RS22DYeB7U14dra4KcQYxmwt5HkOInieXK1NUMBmQI='",
          "'unsafe-eval'" /*"'unsafe-inline'"*/,
        ],
        scriptSrcAttr: ["'none'"],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
    },
  })
);

if (process.env.NODE_ENV === "production") {
  const enforce = require("express-sslify");
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(logger("dev"));

/*var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}*/

app.use(cors());
// app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(errorHandler); // Custom default, i.e., catch-all, error handler middleware

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/matchRoutes")(app, memcache);
require("./routes/paymentRoutes")(app);
require("./routes/test")(app);
require("./routes/userRoutes")(app);

app.use(errorHandler); // Custom default, i.e., catch-all, error handler middleware

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

module.exports = app;
