export {};

const express = require('express');
const router = express.Router();
const routeRoot = '/';

function outputError(req : Request, res : any) {
    res.status(404);
    res.send('Melina! This isn\'t the time to use that!');
}

router.all('*', outputError)

module.exports = {
    router,
    routeRoot,
    outputError
};