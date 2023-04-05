const model = require('../models/pokemonModelMongoDb');
// Can't redeclare block-scoped variable 'errors' - TS 2451
//const errors = require('../errors/Errors');
require('dotenv').config();
const {MongoMemoryServer} = require('mongodb-memory-server');

const dbName = "pokemon_test_db";

let mongod : typeof MongoMemoryServer;
let mongoUrl : string;

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
    console.log("Mock database initialized");
});

afterEach(async () => {
    await model.close();
    console.log("Mock database closed");
});

test('AddPKMN to DB', async () => {
    const pokemon = generatePokemonData();
    await model.addPokemon(pokemon.name, pokemon.type);

    const result = await model.getAllPokemon();
    
    expect(result.length).toBe(1);
    expect(result[0].name).toBe(pokemon.name);
    expect(result[0].type).toBe(pokemon.type.toUpperCase());
});