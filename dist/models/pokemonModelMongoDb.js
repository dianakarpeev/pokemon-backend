"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { MongoClient } = require('mongodb');
const validateUtils = require('./validateUtils');
const errors = require("../errors/Errors");
const collation = { locale: "en", strength: 1 };
//Logging setup
const pino = require('pino');
const transport = pino.transport({
    targets: [
        { target: 'pino-pretty', options: { colorize: true } },
        { target: 'pino/file', options: { destination: './logs/server-log', colorize: true } },
        { target: "pino/file" }
    ]
});
const logger = pino({ level: "info" }, transport);
//Database setup
let client;
let pokemonsCollection;
/**
 *  Attempts to connect to the passed database, resetting the collection if reset is true.
 * @param dbName Name of the database to connect to.
 * @param reset Boolean indicating whether or not to reset the collection.
 * @param url URL of the database client to connect to.
 */
async function initialize(dbName, reset, url) {
    try {
        client = await new MongoClient(url);
        await client.connect();
        logger.info("Connected correctly to server");
        const db = client.db(dbName);
        let collectionCursor = await db.listCollections({ name: "pokemons" });
        let collectionArray = await collectionCursor.toArray();
        pokemonsCollection = db.collection("pokemons");
        if (reset && collectionArray.length > 0) {
            await pokemonsCollection.drop();
            collectionArray = [];
        }
        collectionCursor = await db.listCollections({ name: "pokemons" });
        collectionArray = await collectionCursor.toArray();
        if (collectionArray.length === 0) {
            await db.createCollection("pokemons", { collation: collation });
        }
        pokemonsCollection = db.collection("pokemons");
    }
    catch (err) {
        logger.error(err);
        throw new errors.DatabaseError();
    }
}
/**
 * Closes the connection to the database
 */
async function close() {
    try {
        await client.close();
        logger.info("Connection closed");
    }
    catch (err) {
        logger.error(err);
    }
}
/**
 * Adds a validated pokemon to the currently open database.
 * @param name The name of the pokemon to validate and add.
 * @param type The type of the pokemon to validate and add.
 * @throws DatabaseError if the database is not connected or the insert fails.
 * @throws InvalidInputError if the name or type are invalid.
 */
async function addPokemon(name, type) {
    if (!await validateUtils.isValid(name, type)) {
        throw new errors.InvalidInputError();
    }
    const pokemon = { name: name, type: type };
    const result = await pokemonsCollection.insertOne(pokemon);
    if (!result.acknowledged) {
        throw new errors.DatabaseError();
    }
}
/**
 * Attempts to find a pokemon with the passed name in the currently open database.
 * @param name The name of the pokemon to find.
 * @returns The document from the database with the passed name.
 * @throws DatabaseError if the find fails.
 * @throws FindError if the find returns no results.
 */
async function findSinglePokemon(name) {
    try {
        const result = await pokemonsCollection.findOne({ name: name });
        if (result === null) {
            throw new errors.FindError();
        }
        return result;
    }
    catch (err) {
        if (err instanceof errors.FindError) {
            throw err;
        }
        throw new errors.DatabaseError();
    }
}
/**
 * Attempts to find all pokemon in the currently open database.
 * @returns An array of all documents in the currently open database.
 * @throws DatabaseError if the find fails.
 * @throws FindError if the find returns no results.
 */
async function findAllPokemon() {
    try {
        const result = await pokemonsCollection.find({}).toArray();
        if (result === null || result.length === 0) {
            throw new errors.FindError();
        }
        return result;
    }
    catch (err) {
        if (err instanceof errors.FindError) {
            throw err;
        }
        throw new errors.DatabaseError();
    }
}
module.exports = {
    initialize,
    close,
    addPokemon,
    findSinglePokemon,
    findAllPokemon
};
