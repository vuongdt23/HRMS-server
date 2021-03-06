const express = require ('express');
const bodyParser = require ('body-parser');
const config = require ('../config');
const authenticate = require ('../authenticate');
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
    connection.query (
      'Select  * from Employees left join departments on Employees.department = Departments.depid left join payroll on Employees.payroll = Payroll.payrollid left join positions on Employees.position = positions.posid',
      (err, result) => {
        if (err) {
          return next (err);
        } else if (result) {
          res.statusCode = 200;
          res.setHeader ('Content-Type', 'application/json');
          res.json (result);
          //    connection.close ();
        }
      }
    );
  })
  .post ((req, res, next) => {
    let insertvalue = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      position: req.body.position,
      department: req.body.department,
      payroll: req.body.payroll,
    };
    console.log (insertvalue);
    connection.query (
      'Insert into Employees (name, phone, address, email, position, department, payroll) values (?, ?, ?, ?, ?, ?, ?)',
      [
        insertvalue.name,
        insertvalue.phone,
        insertvalue.address,
        insertvalue.email,
        insertvalue.position,
        insertvalue.department,
        insertvalue.payroll,
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
  .get (authenticate.verifyUser, (req, res, next) => {
    console.log (req.user);
    connection.query (
      'Select  * from Employees left join departments on Employees.department = Departments.depid left join payroll on Employees.payroll = Payroll.payrollid left join positions on Employees.position = positions.posid where id =' +
        req.params.EmployeeId,
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
    res.end (
      'POST operation not supported on /employees/' + req.params.EmployeeId
    );
  })
  .put ((req, res, next) => {
    let updatevalue = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      department: req.body.department,
      position: req.body.position,
      payroll: req.body.payroll,
    };
    connection.query (
      'update employees set employees.name = ?, phone = ?, address = ? , email = ?, department = ?, position = ?, payroll = ? where id = ' +
        req.params.EmployeeId,
      [
        updatevalue.name,
        updatevalue.phone,
        updatevalue.address,
        updatevalue.email,
        updatevalue.department,
        updatevalue.position,
        updatevalue.payroll,
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
  })
  .delete (
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      connection.query (
        'Delete from Employees where id = ' + req.params.EmployeeId,
        (err, result) => {
          if (err) return next (err);
          else if (result) {
            res.statusCode = 200;
            res.setHeader ('Content-Type', 'application/json');
            res.json (result);
          }
        }
      );
    }
  );

module.exports = employeeRouter;
