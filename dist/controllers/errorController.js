"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const routeRoot = '/';
function outputError(req, res) {
    res.status(404);
    res.send('Melina! This isn\'t the time to use that!');
}
router.all('*', outputError);
module.exports = {
    router,
    routeRoot,
    outputError
};
