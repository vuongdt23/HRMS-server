const express = require ('express');
const bodyParser = require ('body-parser');
const config = require ('../config');
const authenticate = require('../authenticate');
const DepartmentRouter = express.Router ();
DepartmentRouter.use (bodyParser.json ());
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

DepartmentRouter.route ('/')
.get (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  connection.query ('Select * from Departments', (err, result) => {
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

module.exports = DepartmentRouter;

