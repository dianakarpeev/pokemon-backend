const validator = require('validator');

const types = ['BUG', 'DARK', 'DRAGON',
    'ELECTRIC', 'FAIRY', 'FIGHTING',
    'FIRE', 'FLYING', 'GHOST', 
    'GRASS', 'GROUND', 'ICE',
    'NORMAL', 'POISON', 'PSYCHIC',
    'ROCK', 'STEEL', 'WATER'];

async function isValid(name : string, type : string) : Promise<boolean> {
    if (! await validator.isAlphanumeric(name) || ! await validator.isLength(name, {min: 1, max: 50})) {
        return false;
    }
    if (! await types.includes(type.toUpperCase())) {
        return false;
    }
    return true;
}

module.exports = {isValid};