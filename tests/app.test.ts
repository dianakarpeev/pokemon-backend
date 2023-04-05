export {};


const model = require('../models/pokemonModelMongoDb');
const errors = require('../errors/Errors');

require('dotenv').config();
const dbName = "pokemon_test_db";
const {MongoMemoryServer} = require('mongodb-memory-server');
let mongod : any;
let mongoUrl : string;

const app = require('../app');
const superTest = require('supertest');
const testRequest = superTest(app);

const pokemonData = [
    { name: 'Bulbasaur', type: 'Grass' },
    { name: 'Ivysaur', type: 'Grass' },
    { name: 'Venusaur', type: 'Grass' },
    { name: 'Charmander', type: 'Fire' },
    { name: 'Charmeleon', type: 'Fire' },
    { name: 'Charizard', type: 'Fire' },
    { name: 'Squirtle', type: 'Water' },
    { name: 'Wartortle', type: 'Water' },
    { name: 'Blastoise', type: 'Water' },
    { name: 'Caterpie', type: 'Bug' },
    { name: 'Metapod', type: 'Bug' },
    { name: 'Butterfree', type: 'Bug' },
    { name: 'Weedle', type: 'Bug' },
    { name: 'Kakuna', type: 'Bug' },
    { name: 'Beedrill', type: 'Bug' },
    { name: 'Pidgey', type: 'Flying' },
    { name: 'Pidgeotto', type: 'Flying' },
    { name: 'Pidgeot', type: 'Flying' },
    { name: 'Rattata', type: 'Normal' },
    { name: 'Raticate', type: 'Normal' }
]

function generatePokemonData() {
    return pokemonData.splice(Math.floor(Math.random() * pokemonData.length), 1)[0];
}

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    mongoUrl = mongod.getUri();
    console.log("Mock database created");
});

afterAll(async () => {
    await mongod.stop();
    console.log("Mock database closed");
});

beforeEach(async () => {
    await model.initialize(dbName, true, mongoUrl);
});

afterEach(async () => {
    await model.close();
});

test('GET /find success', async () => {
    const {name, type} = generatePokemonData();
    await model.addPokemon(name, type);

    const testResponse = await testRequest.get('/find?name=' + name);
    expect(testResponse.status).toBe(200);
});

test('POST /catch success', async () => {
    const {name, type} = generatePokemonData();
    const testResponse = await testRequest.post('/catch').send({name: name, type: type});
    expect(testResponse.status).toBe(200);

    const result = await model.findAllPokemon();
    expect(result.length).toBe(1);
    expect(result[0].name.toLowerCase()).toBe(name.toLowerCase());
    expect(result[0].type.toLowerCase()).toBe(type.toLowerCase());
});