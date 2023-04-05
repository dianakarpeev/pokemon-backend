const pino = require('pino');

const transport = pino.transport({
    targets: [
        { target: 'pino-pretty', options: { colorize: true } },
        { target: 'pino/file', options: { destination: './logs/server-log', colorize: true } },
        { target: "pino/file" }
    ]
});

const logger = pino(
    { level: "info" },
    transport);

module.exports = logger;