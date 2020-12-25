var express = require ('express');
var router = express.Router ();
const bodyParser = require ('body-parser');
router.use (bodyParser.json ());

var passport = require ('passport');
var authenticate = require ('../authenticate');
/* GET users listing. */
router.get ('/', function (req, res, next) {
  res.send ('respond with a resource');
});

router.post ('/login', passport.authenticate ('local'), (req, res) => {
  var token = authenticate.getToken ({_id: req.user.id});
  res.statusCode = 200;
  res.setHeader ('Content-Type', 'application/json');
  res.json ({
    success: true,
    token: token,
    status: 'You are successfully logged in!',
  });
});

module.exports = router;
