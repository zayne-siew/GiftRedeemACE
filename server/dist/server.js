'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const dotenv_1 = require('dotenv');
const tslog_1 = require('tslog');
const app_1 = __importDefault(require('./app'));
const log = new tslog_1.Logger({ minLevel: 3 });
(0, dotenv_1.config)();
const port = process.env.PORT || 5500;
const server = app_1.default.listen(port, () =>
    log.info(`Server is running on port ${port}`)
);
exports.default = server;
