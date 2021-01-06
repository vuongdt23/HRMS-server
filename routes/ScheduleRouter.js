const express = require ('express');
const bodyParser = require ('body-parser');
const config = require ('../config');

const ScheduleRouter = express.Router ();
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

ScheduleRouter.route ('/').all ((req, res, next) => {
  res.redirect ('/schedules/employees');
});
ScheduleRouter.route ('/employees')
  .get ((req, res, next) => {
    connection.query ('Select * from Schedules', (err, result) => {
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
  .put ((req, res, next) => {
    res.statusCode = 403;
    res.end ('Put operation not supported on /schedules/employees');
  })
  .post ((req, res, next) => {
    res.statusCode = 403;
    res.end ('Post operation not supported on /schedules/employees');
  })
  .delete ((req, res, next) => {
    connection.query ('Delete from Schedules', (err, result) => {
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

  ScheduleRouter.route ('/employees/:EmployeeId')
  .get ((req, res, next) => {
    connection.query ('Select * from Schedules where eid = '+ req.params.EmployeeId, (err, result) => {
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
  .post((req, res, next) => {
     //to do: add schedules to specific user

  })
  .put((req, res, next)=>{
      //not supported
  })
  .delete();
  


module.exports = ScheduleRouter;
