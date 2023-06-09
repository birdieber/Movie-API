const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let User = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, callback) => {
      console.log(username + "  " + password);
      User.findOne({ username })
        .then((user) => {
          //validate username
          if (!user) {
            console.log(
              `username:${username} ; user:${user} ; password:${password}`
            );
            console.log("incorrect username");
            return callback(null, false, {
              message: "Incorrect username, please check and write again",
            });
          }
          //validate password
          if (!user.validatePassword(password)) {
            console.log("incorrect password");
            return callback(null, false, {
              message: "Incorrect password, please check and write again",
            });
          }

          console.log("finished");
          return callback(null, user);
        })
        .catch((error) => {
          console.log(error);
          return callback(error);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return User.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
