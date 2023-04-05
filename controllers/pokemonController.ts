export {};

const express = require('express');
const router = express.Router();
const routeRoot = '/';
const model = require('../models/pokemonModelMongoDb');
const errors = require('../errors/Errors');

async function catchPokemon(req : any, res : any) {
    let pokemon = {name: req.body.name, type: req.body.type};
    try {
        await model.addPokemon(pokemon.name, pokemon.type);
        res.send(`You caught a ${pokemon.name}!`);
    } catch (error : any) {
        if (error instanceof errors.DatabaseError) {
            res.status(500);
            res.send('Can\t connect to PC!' + error.message);
        }
        if (error instanceof errors.InvalidInputError) {
            res.status(400);
            res.send('Pokemon not recognized!' + error.message);
        }
    }
}

async function findPokemon(req : any, res : any) {
    let name = req.query.name;
    try {
        let pokemon = await model.findSinglePokemon(name);
        res.send(`${pokemon.name} added to party!`);
    } catch (error : any) {
        if (error instanceof errors.DatabaseError) {
            res.status(500);
            res.send('Can\t connect to PC!' + error.message);
        }
        if (error instanceof errors.FindError) {
            res.status(404);
            res.send('Pokemon not found!' + error.message);
        }
    }
}

router.post('/catch', catchPokemon);
router.get('/find', findPokemon);

module.exports = {
    router,
    routeRoot,
    
};