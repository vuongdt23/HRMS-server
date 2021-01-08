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

PayrollRouter.route ('/')
  .get (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
  })
  .post (
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      let insertvalue = {
        payrolldescr: req.body.payrolldescr,
        amount: req.body.amount,
      };
      connection.query (
        'insert into payroll (payrolldescr, amount) values(?, ?)',
        [insertvalue.payrolldescr, insertvalue.amount],
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
    }
  );

  PayrollRouter.route ('/:payrollID')
  .delete (
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      connection.query (
        'Delete from payroll where payrollid = ' + req.params.payrollID,
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
  )
  .put (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let updatevalue = {
      payrolldescr: req.body.payrolldescr,
      amount: req.body.amount,
    };
    connection.query (
      'update payroll set payrolldescr =?, amount =? where payrollid = ' +
        req.params.payrollID,
      [updatevalue.payrolldescr, updatevalue.amount],
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
  .get (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    connection.query (
      'Select * from payroll where payrollid = ' + req.params.payrollID,
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
  });
module.exports = PayrollRouter;
