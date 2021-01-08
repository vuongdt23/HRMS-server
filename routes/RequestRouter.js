const express = require ('express');
const bodyParser = require ('body-parser');
const config = require ('../config');
const authenticate = require ('../authenticate');

const RequestRouter = express.Router ();
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

RequestRouter.route (
  '/'
).get (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  connection.query (
    'Select * from requests left join employees on requests.eid = employees.id',
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
});
RequestRouter.route ('/:reqId')
  .get (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    connection.query (
      'Select * from requests left join employees on requests.eid = employees.id where resid = ' +
        req.params.reqId,
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
  .put (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let update = {resrespond: req.body.resrespond};
    connection.query (
      'Update requests set resrespond =  ' +
        req.body.resrespond +
        ' where resid =' +
        req.params.reqId,
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
  });

RequestRouter.route ('/employees/:EmployeesID')
  .get ((req, res, next) => {
    connection.query (
      'Select * from requests left join employees on requests.eid = employees.id where eid =' +
        req.params.EmployeesID,
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
      eid: req.params.EmployeesID,
      resdescr: req.body.resdescr,
      restitle: req.body.restitle,
    };
    connection.query (
      'insert into requests (eid, resdescr, restitle) values (?, ? ,? )',
      [insertvalue.eid, insertvalue.resdescr, insertvalue.restitle],
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
  });
module.exports = RequestRouter;
