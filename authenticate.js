var passport = require ('passport');
var LocalStrategy = require ('passport-local').Strategy;
var JwtStrategy = require ('passport-jwt').Strategy;
var ExtractJwt = require ('passport-jwt').ExtractJwt;
var jwt = require ('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require ('./config.js');
var mysql = require ('mysql');

var connection = mysql.createConnection ({
  host: config.mysqlhost,
  user: config.mysqluser,
  password: config.mysqlpassword,
  database: config.mysqldb,
});

connection.connect (err => {
  if (err) next (err);
});

passport.serializeUser (function (user, done) {
  console.log('user:', user);
  done (null, user.id);

});

passport.deserializeUser ((id, done) => {
  connection.query (
    'select * from useraccounts where id = ' + id,
    (err, result) => {
      done (err, result[0]);
      console.log(result[0]);
    }
  );
});
exports.local = passport.use (
  new LocalStrategy ((username, password, done) => {
    connection.query (
      "select * from useraccounts where `username` = '" + username + "'",
      (err, result) => {
        if (err) {
          return done (err);
        }
        if (!result.length) {
          return done (null, false);
        }
        if (password != result[0].password) {
          return done (null, false);
        }
        return done (null, result[0]);
      }
    );
  })
);

exports.getToken = function (user) {
  console.log("user: ");
  console.log(user);
  console.log("user: ");
  return jwt.sign (user, config.secretKey, {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use (
  new JwtStrategy (opts, (jwt_payload, done) => {
    console.log ('JWT payload: ', jwt_payload);
    connection.query (
      "select * from useraccounts where `id` = '" + jwt_payload._id + "'",
      (err, user) => {
        if (err) {
          return done (err, false);
        } else if (user) {
          console.log (jwt_payload._id);
          console.log (user);
          return done (null, user[0]);
        } else {
          return done (null, false);
        }
      }
    );
  })
);

exports.verifyUser = passport.authenticate ('jwt', {session: false});

exports.verifyAdmin = function (req, res, next) {
  User.findOne ({_id: req.user._id})
    .then (
      user => {
        console.log ('User: ', req.user);
        if (user.admin) {
          next ();
        } else {
          err = new Error ('You are not authorized to perform this operation!');
          err.status = 403;
          return next (err);
        }
      },
      err => next (err)
    )
    .catch (err => next (err));
};
