import http from 'http';

import app from './app';
import config from './config/config';

http
    .createServer(app)
    .listen(config.port, () => {
        console.log(`HTTP server running on port ${config.port}`)
    });
