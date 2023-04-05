export {};

require('dotenv').config();
const app = require('./app');
const port = 1339;
const model = require('./models/pokemonModelMongoDb');
const url = process.env.URL_PRE! + process.env.MONGODB_PWD! + process.env.URL_POST!;

model.initialize("pokemon_db", false, url)
.then( app.listen(port));