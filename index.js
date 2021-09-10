const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config= require('config');
const Joi = require('joi');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const courses = require('./routes/courses');
const home = require('./routes/home');

const logger = require('./middleware/logger');
const app = express();

app.set('view engine' , 'pug');
app.set('views','./views');

app.use(express.json());
app.use(logger);
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny')); 
app.use('/api/courses',courses);
app.user('/',home);

//configuration
console.log('Application name: ' +config.get('name'));
console.log('Mail server: '+config.get('mail.host'));
 

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

app.get('/' , (req,res)=>{
    res.render('index',{ title:'My Express app',message:'Hello' });
});

//Db work
dbDebugger('Conneccted to the database');

const port = process.env.PORT || 3000;
app.listen(port,() => {console.log(`Listening on port ${port}`)});