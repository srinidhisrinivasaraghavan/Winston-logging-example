var express = require('express');
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console 
var app = express();

var router = express.Router();

//create a console logger with options
winston.remove(winston.transports.Console);
var options ={
	colorize:true
};

//add logs to console
winston.add(winston.transports.Console, options);

//add logs to file
winston.add(winston.transports.File, { filename: './logs/logs.log' });

router.get('/', function(req, res, next) {	
	winston.info('Info');
  	winston.warn('Warn');
  	winston.error('Error');	
  	winston.log('info','log with info');
  	winston.log('warn','log with warn');
  	winston.log('error','log with error');
    res.send('Hello World from express-winston logger');
});

router.get('/error', function(req, res, next) {
    // here we cause an error in the pipeline so we see express-winston in action. 
    return next(new Error("OOPS..Something wrong happened"));
});

expressWinston.bodyBlacklist.push('trace');

//to log messages on request onto file and console
app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/requests.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: 'info',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    meta: false,
    expressFormat: true, 
    statusLevels:true,
    exitOnError: false,
    msg: "HTTP\t {{req.method}} \t\ {{req.url}}\t {{res.statusCode}}\ t{{res.responseTime}}ms",
}));

app.use(router);


app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
        	level: 'error',
            filename: './logs/errors.log',
            json: false,
            formatter: function(options) {
       		 	return JSON.stringify(options,null, 2);
      		},
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
        	level: 'error',
            json: false,
            formatter: function(options) {
       		 	return "";
      		},
            colorize: true
        })
    ],
    meta: false,
    expressFormat: true, 
    statusLevels:true,
    exitOnError: false
}));

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});