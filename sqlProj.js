


var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3132);

app.get('/',function(req,res,next){
var context = {};
mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
   if(err){
       next(err);
       return;
   }
   context.exercise =    rows;
   res.render('home', context);
});
});


app.post('/insert',function(req,res){
   var context = {};
  
       mysql.pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)", [req.body.name,req.body.reps,req.body.weight,req.body.date,req.body.lbs], function(err, result){
           if(err){
               next(err);
               return;
           }
       });

   mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
   if(err){
       next(err);
       return;
   }
   context.exercise =    rows;
   res.render('home',context);
   });
});


app.post('/delete',function(req,res){

  mysql.pool.query("DELETE FROM workouts WHERE id = ?", [req.body.id], function(err, result){
       if(err){
          next(err);
          return;
           }
       });

   res.render('home',context);
       
});

   
   
///simple-update?id=2&name=The+Task&done=false&due=2015-12-5
app.get('/update',function(req,res,next){
   var context = {};
   res.render('home',context);
});

app.post('/update',function(req,res,next){

  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
      var curVals = result[0];
      console.log(curVals);
      mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.lbs || curVals.lbs, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        


        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
});
});

app.get('/reset-table',function(req,res,next){
  var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
