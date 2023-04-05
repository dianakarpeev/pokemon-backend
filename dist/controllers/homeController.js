"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const routeRoot = '/';
router.get('/', sayHello);
function sayHello(req, res) {
    res.send('Hello there! Welcome to the world of Pokémon! My name is Oak! People call me the Pokémon Prof!');
}
module.exports = {
    router,
    routeRoot,
    sayHello
};
