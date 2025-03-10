const passport = require("passport");
const requireAdmin = require("../middlewares/requireAdmin.js");
const { LoginFailed } = require("../errors.js");

module.exports = (app) => {
  /***
   * Utilizes a custom callback for passport.authenticate
   * in order to exercise full control over return, function, signature, etc.
   */
  app.post("/auth/local", async (req, res, next) => {
    passport.authenticate("local", function (err, user) {
      try {
        if (err) return next(err);
        if (!user) throw new LoginFailed();
        const message = `Glad to see you again, ${user.fullName}`;
        res.send({ message });
      } catch (e) {
        next(e);
      }
    })(req, res, next);
  });

  app.post("/auth/become", requireAdmin, async (req, res, next) => {
    passport.authenticate("become", function (err, user) {
      try {
        if (err) return next(err);
        if (!user) throw new LoginFailed();
        const message = `You are now impersonating ${user.fullName}`;
        res.send({ message });
      } catch (e) {
        next(e);
      }
    })(req, res, next);
  });

  /* https://developers.google.com/identity/protocols/oauth2/openid-connect */
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      display: "popup",
      prompt: "select_account",
    })
  );

  app.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
    //console.log(JSON.stringify(req.user, null, 4));
    res.redirect("/success");
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    //throw new Error('unable to obtain current user...');
    res.send(req.user);
  });
};
