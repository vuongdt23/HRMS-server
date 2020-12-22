var passport = require ('passport');
//ar LocalStrategy = require ('passport-local').Strategy;
var User = require ('./models/users');
var JwtStrategy = require ('passport-jwt').Strategy;
var ExtractJwt = require ('passport-jwt').ExtractJwt;
var jwt = require ('jsonwebtoken');
var config = require ('./config');
var mysql = require ('mysql');
var connection = mysql.createConnection ({
  host: config.mysqlhost,
  user: config.mysqluser,
  password: config.mysqlpassword,
  database: config.mysqldb,
});

exports.local = passport.use (
  new LocalStrategy ((username, password, done) => {
    connection.query (
      'Select * from employees where username = ' + username,
      (err, result) => {
        if (err) {
          return done (err, false);
        } else if (!result) {
          return done (null, username);
        } else if (password != result[0].password) {
          return done (null, false);
        }
        return done (null, result[0]);
      }
    );
  })
);
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    connection.query("select * from users where id = "+id,function(err,rows){	
        done(err, rows[0]);
    });
});
//passport.serializeUser (User.serializeUser ());
//passport.deserializeUser = User.deserializeUser ();

exports.getToken = function (user) {
  return jwt.sign (user, config.secretKey, {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme ('Bearer');
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use (
  new JwtStrategy (opts, (jwt_payload, done) => {
    console.log ('JWT payload: ', jwt_payload);
    User.findOne ({id: jwt_payload.id}, (err, user) => {
      if (err) {
        return done (err, false);
      } else if (user) {
        return done (null, user);
      } else {
        return done (null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate ('jwt', {session: false});
