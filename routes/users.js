var express = require ('express');
var router = express.Router ();
const bodyParser = require ('body-parser');
router.use (bodyParser.json ());
var config = require ('../config.js');
var mysql = require ('mysql');
const authenticate = require ('../authenticate');

var connection = mysql.createConnection ({
  host: config.mysqlhost,
  user: config.mysqluser,
  password: config.mysqlpassword,
  database: config.mysqldb,
});

connection.connect (err => {
  if (err) next (err);
});
var passport = require ('passport');
const {query} = require ('express');
/* GET users listing. */
router
  .route ('/:userId')
  .get (authenticate.verifyUser, function (req, res, next) {
    connection.query (
      'Select permission from useraccounts where id = ' + req.params.userId,
      (err, result) => {
        if (err) {
          return next (err);
        } else if (result) {
          res.statusCode = 200;
          res.setHeader ('Content-Type', 'application/json');
          res.json (result[0]);
        }
      }
    );
  });

router.post ('/login', passport.authenticate ('local'), (req, res) => {
  var token = authenticate.getToken ({_id: req.user.id});
  res.statusCode = 200;
  res.setHeader ('Content-Type', 'application/json');

  res.json ({
    success: true,
    token: token,
    id: req.user.id,
    status: 'You are successfully logged in!',
  });

  //Server will give back userid and token for future requests
});

module.exports = router;
