const express = require ('express');
const bodyParser = require ('body-parser');
const config = require ('../config');
const authenticate = require ('../authenticate');
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
  })
  .post (
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      let insertvalue = {
        depname: req.body.depname,
        depdescr: req.body.depdescr,
      };
      connection.query (
        'insert into departments (depname, depdescr) values(?, ?)',
        [insertvalue.depname, insertvalue.depdescr],
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
DepartmentRouter.route ('/:depID')
  .delete (
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      connection.query (
        'Delete from departments where depid = ' + req.params.depID,
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
      depname: req.body.depname,
      depdescr: req.body.depdescr,
    };
    connection.query (
      'update departments set depname =?, depdescr =? where depid = ' +
        req.params.depID,
      [updatevalue.depname, updatevalue.depdescr],
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
      'Select * from departments where depid = ' + req.params.depID,
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
module.exports = DepartmentRouter;
