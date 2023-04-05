export {};

const express = require('express');
const app = express();
const logger = require('./logger');
const pinohttp = require('pino-http');
const httpLogger = pinohttp({logger: logger})
app.use(httpLogger);

app.use(express.json());

const controllers = ['homeController', 'pokemonController', 'errorController'];

const listEndPoint = require('express-list-endpoints');
const expressListRoutes = require('express-list-routes');

controllers.forEach((controllerName) => {
    try {
        const controllerRoutes = require('./controllers/' + controllerName);
        app.use(controllerRoutes.routeRoot, controllerRoutes.router);
    } catch (err) {
        console.error(err);
        throw err;
    }
});

console.log(listEndPoint(app));

module.exports = app;
