const express = require ('express');
const bodyParser = require ('body-parser');
const config = require ('../config');
const authenticate = require ('../authenticate');
const PositionRouter = express.Router ();
PositionRouter.use (bodyParser.json ());
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

PositionRouter.route ('/')
  .get (authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    connection.query ('Select * from Positions', (err, result) => {
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
        posname: req.body.posname,
        posdescr: req.body.posdescr,
      };
      connection.query (
        'insert into positions (posname, posdescr) values(?, ?)',
        [insertvalue.posdescr, insertvalue.posdescr],
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

  PositionRouter.route ('/:posID')
  .delete (
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      connection.query (
        'Delete from positions where posid = ' + req.params.posID,
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
      posname: req.body.depname,
      posdescr: req.body.depdescr,
    };
    connection.query (
      'update positions set posname =?, posdescr =? where depid = ' +
        req.params.depID,
      [updatevalue.posname, updatevalue.posname],
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
      'Select * from positions where posid = ' + req.params.posID,
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
module.exports = PositionRouter;
