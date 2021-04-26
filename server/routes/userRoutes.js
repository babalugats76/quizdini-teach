const mongoose = require("mongoose");
const md5 = require("md5");
const requireLogin = require("../middlewares/requireLogin");
const Sequence = mongoose.model("sequence");
const Country = mongoose.model("country");
const State = mongoose.model("state");
const User = mongoose.model("user");
const Token = mongoose.model("token");
const { sendRecoveryEmail, sendRegisterEmail, sendResetEmail } = require("../services/email");
const {
  DuplicateEmail,
  DuplicateUsername,
  IncorrectPassword,
  InvalidToken,
} = require("../errors.js");
const { nanoid } = require("nanoid");
const { format, utcToZonedTime } = require("date-fns-tz");

/**
 * Basic URL helper for user routes
 *
 * To build URLs suitable for inclusion in emails, etc.
 *
 * @param {Object}   req               Express request object
 * @param {Object}   options           URL components
 * @param {string}   options.path      resource path for URI
 * @param {Object}   options.params    (Optional) query params
 * @param {string}   options.protocol  HTTP protocol
 * @returns {string}                   complete URL
 *
 * May have to add request.headers["x-forwarded-host"] behind proxy
 *
 */
const buildUrl = (req, { path = "", params = {}, protocol = "https" }) => {
  // base URL
  var url =
    process.env.NODE_ENV !== "production" ? `http://${req.host}:3000` : `${protocol}://${req.host}`;

  // append URI path (optional)
  url += path ? "/" + path : "";

  // append params (optional)
  url += Object.keys(params).length
    ? Object.entries(params).map(([k, v], i) => {
        return (i === 0 ? "?" : "&") + k + "=" + encodeURIComponent(v);
      })
    : "";
  return url;
};

module.exports = (app) => {
  app.post("/api/account", async (req, res, next) => {
    try {
      const {
        title,
        firstName,
        lastName,
        city,
        countryCode,
        stateCode,
        email,
        username,
        password,
      } = req.body;

      // Check for duplicate username
      const usernameTaken = await User.findOne({
        $and: [
          { username: username.toLowerCase() },
          { username: { $exists: true } },
          { googleId: { $exists: false } },
        ],
      });

      if (usernameTaken) throw new DuplicateUsername(username);

      // Check for duplicate email
      const emailTaken = await User.findOne({
        $and: [
          { email: email.toLowerCase().trim() },
          { email: { $exists: true } },
          { googleId: { $exists: false } },
        ],
      });

      if (emailTaken) throw new DuplicateEmail(email);

      // Generate a new customer sequence
      const { seq: customerId } = await Sequence.findOneAndUpdate(
        { name: "customer" },
        { $inc: { seq: 1 } },
        { returnNewDocument: true }
      );

      // Create user record
      const user = await new User({
        title,
        firstName,
        lastName,
        city,
        countryCode,
        stateCode,
        email,
        customerId,
        username,
        password: md5(password),
        verified: false,
        createDate: Date.now(),
      }).save();

      // Generate secret token (for account verification)
      const token = await new Token({
        secret: nanoid(), // generates URL-friendly symbols
        expiryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        user_id: user.id,
        createDate: new Date(),
      }).save();

      // Send email, welcome plus verification
      try {
        await sendRegisterEmail({
          toAddress: user.email,
          firstName: user.firstName,
          fullName: user.fullName,
          verifyUrl: buildUrl(req, { path: "verify", params: { secret: token.secret } }),
        });
        console.log("Queued email (registration): %s, %s", user.fullName, user.email);
      } catch (e) {
        console.log("Unable to queue email (registration): %s, %s", user.fullName, user.email);
      }

      console.log("User Registration: %s, %s", user.fullName, user.email);
      const message = `Check your email, ${user.email}, for a link to verify your account.`;
      res.send({ message });
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/account", requireLogin, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user.id });
      res.send(user);
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/account", requireLogin, async (req, res, next) => {
    try {
      //throw new Error("Test account update error handling...");
      // Limit user updates to a narrow subset of fields
      const { city, countryCode, firstName, lastName, stateCode, title } = req.body;

      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          city,
          countryCode,
          firstName,
          lastName,
          stateCode,
          title,
          updateDate: new Date(),
        },
        { new: true, useFindAndModify: false }
      );
      res.send(user);
    } catch (e) {
      next(e);
    }
  });

  app.post("/api/account/lost", async (req, res, next) => {
    try {
      const timeZone = req.header("quizdini-timezone") || "UTC";
      const { email, recoveryType = "password" } = req.body;
      const message = `If there is an account associated with ${email}, then a ${
        recoveryType === "password" ? "password reset" : "username recovery"
      } email has been sent.`;

      /* limited to 'local', verified users with matching email  */
      const user = await User.findOne({
        $and: [
          { email },
          { password: { $exists: true } },
          { verified: true },
          { googleId: { $exists: false } },
        ],
      });

      if (!user) {
        // user lookup fails
        return res.send({ message });
      }

      // destructure fields needed to send email
      const { email: toAddress, firstName, fullName, username } = user;

      if (recoveryType === "password") {
        // Generate secret token (for reset verification)
        const token = await new Token({
          secret: nanoid(), // generates URL-friendly symbols
          expiryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // A day from the time on the server
          user_id: user.id,
          createDate: new Date(),
        }).save();

        let localExpiryDate = utcToZonedTime(token.expiryDate, timeZone);
        localExpiryDate = format(
          localExpiryDate,
          "MMM do, yyyy 'at' h:mm aa (zzz)", // Aug 28th, 2019 at 10:09 PM (MDT)
          {
            timeZone,
          }
        );

        try {
          await sendResetEmail({
            toAddress,
            firstName,
            fullName,
            resetUrl: buildUrl(req, { path: "reset", params: { secret: token.secret } }),
            resetExpiryDate: localExpiryDate,
          });
          console.log("Queued email (recovery): %s, %s", fullName, toAddress);
        } catch (e) {
          console.log("Unable to queue email (recovery): %s, %s", fullName, toAddress);
        }
      } else {
        const loginUrl = buildUrl(req, { path: "login" });

        try {
          await sendRecoveryEmail({
            toAddress,
            firstName,
            fullName,
            username,
            loginUrl,
          });
          console.log("Queued email (recovery): %s, %s", fullName, toAddress);
        } catch (e) {
          console.log("Unable to queue email (recovery): %s, %s", fullName, toAddress);
        }
      }

      res.send({ message });
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/account/password", requireLogin, async (req, res, next) => {
    try {
      // Get payload
      const { newPassword, oldPassword } = req.body;
      // Lookup User
      const user = await User.findOne({
        $and: [
          { _id: req.user.id },
          { password: { $exists: true } },
          { verified: true },
          { googleId: { $exists: false } },
        ],
      });
      // Verify credentials
      if (user.password !== md5(oldPassword)) throw new IncorrectPassword();

      // Update credentials
      user.password = md5(newPassword);
      user.updateDate = new Date();
      await user.save();

      // Return "success" message
      const message = "Your password has been updated.";
      res.send({ message });
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/account/password-reset", async (req, res, next) => {
    try {
      const { newPassword, secret } = req.body;

      const token = await Token.findOne({
        $and: [{ secret }, { claimed: false }, { expiryDate: { $gte: new Date().toISOString() } }],
      });

      if (!token) throw new InvalidToken();

      await User.findOneAndUpdate(
        {
          $and: [{ _id: token.user_id }, { verified: true }, { googleId: { $exists: false } }],
        },
        { password: md5(newPassword), updateDate: new Date() },
        { new: true, useFindAndModify: false }
      );

      token.claimed = true;
      token.updateDate = new Date();
      await token.save();

      const message = "Your password has been reset.";
      res.send({ message });
    } catch (e) {
      next(e);
    }
  });

  app.put("/api/account/verify", async (req, res, next) => {
    try {
      const { secret } = req.body;
      const token = await Token.findOne({
        $and: [
          { secret: secret },
          { claimed: false },
          { expiryDate: { $gte: new Date().toISOString() } },
        ],
      });

      if (!token) throw new InvalidToken();

      const user = await User.findOneAndUpdate(
        {
          $and: [{ _id: token.user_id }, { verified: false }, { googleId: { $exists: false } }],
        },
        { verified: true, updateDate: new Date() },
        { new: true, useFindAndModify: false }
      );

      token.claimed = true;
      token.updateDate = new Date();
      await token.save();
      console.log("Account Verified: %s, %s", user.fullName, secret);
      const message = "Your account has been verified.";
      res.send({ message });
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/countries", async (req, res, next) => {
    try {
      //throw new Error("testing countries error...");
      const countries = await Country.find().sort({ countryId: "asc" });
      if (!countries) return res.send({}); // Return empty Object to signify not found
      res.send(countries);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/states", async (req, res, next) => {
    try {
      //throw new Error('testing states error...');
      const states = await State.find().sort({ stateCode: "asc" });
      if (!states) return res.send({}); // Return empty Object to signify not found
      res.send(states);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/token/:secret", async (req, res, next) => {
    try {
      const token = await Token.findOne({
        $and: [
          { secret: req.params.secret },
          { claimed: false },
          { expiryDate: { $gte: new Date().toISOString() } },
        ],
      });
      if (!token) throw new InvalidToken();
      return res.send(token);
    } catch (e) {
      next(e);
    }
  });
};
