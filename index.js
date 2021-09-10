const config= require('config');
const Joi = require('joi');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const logger = require('./logger');
const app = express();

app.use(express.json());
app.use(logger);
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny')); 

//configuration
console.log('Application name: ' +config.get('name'));
console.log('Mail server: '+config.get('mail.host'));
 

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

const courses = [
    {id: 1,name : 'course1'},
    {id: 2,name: 'course2'},
    {id: 3,name: 'course3'}];

app.get('/', (req,res) => {
    res.send('Hello world');
})

app.get('/api/courses' , (req,res)=> {
    res.send(courses);
})

app.get('/api/courses/:id',(req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send('The course was not found');
    }else{
        res.send(course);
    }
})

app.post('/api/courses/' , (req,res)=> {
    const schema = {
        name:Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body,schema);
    console.log(result);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id:courses.length+1,
        name:req.body.name
    }
    courses.push(course);
    res.send(course); 
})

const port = process.env.PORT || 3000;
app.listen(port,() => {console.log(`Listening on port ${port}`)});