const express = require ('express');
const bodyParser = require ('body-parser');
const config = require ('../config');
const authenticate = require('../authenticate');
const employeeRouter = express.Router ();
employeeRouter.use (bodyParser.json ());
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

employeeRouter
  .route ('/')
  .get (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    connection.query ('Select * from Employees', (err, result) => {
      if (err) {
        return next (err);
      } else if (result) {
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json');
        res.json (result);
        //    connection.close ();
      }
    });
  })
  .post ((req, res, next) => {
    let insertvalue = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      descr: req.body.descr,
      email: req.body.email,
    };
    console.log (JSON.stringify (insertvalue));
    connection.query (
      'Insert into Employees (name, phone, address, descr, email) values (?, ?, ?, ?, ?);',
      [
        insertvalue.name,
        insertvalue.phone,
        insertvalue.address,
        insertvalue.descr,
        insertvalue.email,
      ],
      (err, result) => {
        if (err) return next (err);
        else {
          res.statusCode = 200;
          res.setHeader ('Content-Type', 'application/json');
          res.json (result);
          //  connection.close ();
        }
      }
    );
  })
  .put ((req, res, next) => {
    res.statusCode = 403;
    res.end ('PUT operation not supported on /employees');
  })
  .delete ((req, res, next) => {
    connection.query ('Delete from employees', (err, result) => {
      if (err) return next (err);
      else {
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json');
        res.json (result);
      }
    });
  });

employeeRouter
  .route ('/:EmployeeId')
  .get ((req, res, next) => {
    connection.query (
      'Select * from Employees where id = ' + req.params.EmployeeId,
      (err, result) => {
        if (err) {
          return next (err);
        } else if (result) {
          res.statusCode = 200;
          res.setHeader ('Content-Type', 'application/json');
          res.json (result);
        }
      }
    );
  })
  .post ((req, res, next) => {
    res.statusCode = 403;
    res.end ('POST operation not supported on /employees/' + req.params.EmployeeId);
  })
  .put ((req, res, next) => {
    let updatevalue = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      descr: req.body.descr,
      email: req.body.email,
    };
    connection.query (
      'update employees set name = ?, phone = ?, address = ? , descr = ?, email = ? where id = ' + req.params.EmployeeId,
      [
        updatevalue.name,
        updatevalue.phone,
        updatevalue.address,
        updatevalue.descr,
        updatevalue.email,
      ],
      (err, result) => {
        if (err) return next (err);
        else if (result) {
          res.statusCode = 200;
          res.setHeader ('Content-Type', 'application/json');
          res.json (result);
        }
      }
    );
  });

module.exports = employeeRouter;
