const express = require('express');
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex');

const register = require('./controllers/register.js');
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

const db = process.env.DATABASE_URL ?
  knex({
    client: 'pg',
    connection:{
      connectionString: process.env.DATABASE_URL,
      host: process.env.DATABASE_HOST,
      port: 5432,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PW,
      database: process.env.DATABASE_DB
   }
  }) : knex({
    client: 'pg',
    connection: {
      host : '127.0.01',
      port : 5432,
      user : 'kvs',
      password : 'kvs',
      database : 'smartbrain',
    }
});


if(!process.env.DATABASE_URL){
  console.log('process.env.DATABASE_URL does not exist!');
  console.log('Creating local connection to db');
}

console.log(db);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {db.select('*').from('users').then(allUsers => res.send(allUsers))});
app.post('/signin', (req,res) => signin.handleSignin(req, res, db, bcrypt), (req,res) => res.send(error));
app.post('/register',(req, res) => register.handleRegister(req, res, db, bcrypt), (req,res) => res.send(error));
app.get('/profile/:id', (req,res) => profile.handleProfile(req, res, db));
app.put('/image', (req,res) => image.handleImage(req,res,db));
app.post('/imageurl', (req,res) => image.handleApiCall(req,res));

app.listen(PORT, () =>{
    console.log(`App is running on port ${PORT}`);
});