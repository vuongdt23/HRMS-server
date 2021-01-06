const express = require ('express');
const bodyParser = require ('body-parser');
const config = require ('../config');
const authenticate = require ('../authenticate');
const PayrollRouter = express.Router ();
PayrollRouter.use (bodyParser.json ());
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

PayrollRouter.route (
  '/'
).get (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  connection.query ('Select * from Payroll', (err, result) => {
    if (err) {
      return next (err);
    } else if (result) {
      res.statusCode = 200;
      res.setHeader ('Content-Type', 'application/json');
      res.json (result);
      //    connection.close ();
    }
  });
});
// PayrollRouter.route (
//   '/:userId'
// ).get (authenticate.verifyUser, (req, res, next) => {
//   connection.query (
//     'Select * from Payroll = ' + req.params.userId,
//     (err, result) => {
//       if (err) {
//         return next (err);
//       } else if (result) {
//         res.statusCode = 200;
//         res.setHeader ('Content-Type', 'application/json');
//         res.json (result);
//         //    connection.close ();
//       }
//     }
//   );
// });

module.exports = PayrollRouter;
